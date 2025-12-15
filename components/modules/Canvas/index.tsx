import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Eraser, Trash2, Save, Undo, FolderOpen, Plus, Palette, Maximize } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Drawing } from '../../../types';
import { TiltCard } from '../../ui/TiltCard';
import { MagneticButton } from '../../ui/MagneticButton';

interface Point { x: number; y: number; }
interface Path { points: Point[]; color: string; width: number; }

export default function CanvasModule() {
  const { saveDrawing, deleteDrawing, drawings } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#89b4fa');
  
  const [showGallery, setShowGallery] = useState(false);
  const [title, setTitle] = useState('');
  const [activeDrawingId, setActiveDrawingId] = useState<string | null>(null);

  // Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, [paths, canvasRef.current?.parentElement?.clientWidth]);

  const startDraw = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const newPath = {
      points: [{ x: e.clientX - rect.left, y: e.clientY - rect.top }],
      color: currentTool === 'eraser' ? '#1e1e2e' : color, // Eraser matches bg
      width: currentTool === 'eraser' ? 30 : 3
    };
    setPaths([...paths, newPath]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const newPaths = [...paths];
    newPaths[newPaths.length - 1].points.push(point);
    setPaths(newPaths);
  };

  const endDraw = () => setIsDrawing(false);

  const handleSave = async () => {
    const name = title || `Untitled ${new Date().toLocaleDateString()}`;
    await saveDrawing(name, JSON.stringify(paths), activeDrawingId || undefined);
    setTitle('');
  };

  const loadDrawing = (drawing: Drawing) => {
    setPaths(JSON.parse(drawing.data));
    setActiveDrawingId(drawing.id);
    setTitle(drawing.title);
    setShowGallery(false);
  };

  const clearCanvas = () => {
    setPaths([]);
    setActiveDrawingId(null);
    setTitle('');
  };

  return (
    <div className="h-full flex gap-6 animate-fade-in relative pb-6">
      
      {/* TOOLBAR */}
      <TiltCard className="absolute top-6 left-6 z-20 flex gap-3 bg-[#252535]/90 backdrop-blur-xl p-3 rounded-2xl border border-[#313244] shadow-2xl items-center">
        <MagneticButton onClick={() => setShowGallery(!showGallery)} className="p-3 rounded-xl bg-[#1e1e2e] text-[#a6adc8] hover:text-white border border-[#313244] hover:border-[#89b4fa] transition-all" title="Gallery">
          <FolderOpen size={20} />
        </MagneticButton>
        <div className="w-px h-8 bg-[#313244] mx-1" />
        
        <div className="relative group rounded-xl overflow-hidden border border-[#313244] w-10 h-10 cursor-pointer shadow-inner">
            <input 
            type="color" 
            value={color} 
            onChange={(e) => { setColor(e.target.value); setCurrentTool('pen'); }}
            className="absolute inset-0 w-[150%] h-[150%] p-0 m-[-25%]" 
            />
        </div>

        <MagneticButton 
          onClick={() => setCurrentTool('pen')}
          className={`p-3 rounded-xl transition-all border ${currentTool === 'pen' ? 'bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa] shadow-[0_0_15px_rgba(137,180,250,0.4)]' : 'bg-[#1e1e2e] text-[#a6adc8] border-[#313244]'}`}
        >
          <MousePointer2 size={20} />
        </MagneticButton>
        <MagneticButton 
            onClick={() => setCurrentTool('eraser')}
            className={`p-3 rounded-xl transition-all border ${currentTool === 'eraser' ? 'bg-[#f38ba8] text-[#1e1e2e] border-[#f38ba8] shadow-[0_0_15px_rgba(243,139,168,0.4)]' : 'bg-[#1e1e2e] text-[#a6adc8] border-[#313244]'}`}
        >
          <Eraser size={20} />
        </MagneticButton>
        <MagneticButton onClick={() => setPaths(paths.slice(0, -1))} className="p-3 rounded-xl bg-[#1e1e2e] text-[#a6adc8] hover:text-white border border-[#313244]">
          <Undo size={20} />
        </MagneticButton>
        <MagneticButton onClick={clearCanvas} className="p-3 rounded-xl bg-[#1e1e2e] text-[#f38ba8] hover:bg-[#f38ba8]/20 border border-[#313244]">
          <Trash2 size={20} />
        </MagneticButton>
        <div className="w-px h-8 bg-[#313244] mx-1" />
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Untitled Art" 
          className="bg-[#1e1e2e] px-4 py-2 rounded-xl text-white border border-[#313244] outline-none text-sm w-32 focus:w-48 transition-all focus:border-[#89b4fa]"
        />
        <MagneticButton onClick={handleSave} className="p-3 rounded-xl bg-[#a6e3a1] text-[#1e1e2e] hover:bg-white transition-all shadow-[0_0_15px_rgba(166,227,161,0.4)]">
          <Save size={20} />
        </MagneticButton>
      </TiltCard>

      {/* GALLERY OVERLAY */}
      {showGallery && (
        <TiltCard className="absolute top-24 left-6 z-30 w-72 bg-[#252535]/95 backdrop-blur-xl border border-[#313244] rounded-3xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-left-4 fade-in duration-300">
          <h3 className="font-black text-white mb-6 flex items-center gap-2 text-lg">
            <Palette className="text-[#89b4fa]" size={20} /> Art Gallery
          </h3>
          <div className="space-y-3">
            <button onClick={clearCanvas} className="w-full text-left p-3 rounded-xl hover:bg-[#1e1e2e] text-[#89b4fa] flex items-center gap-2 border border-transparent hover:border-[#89b4fa]/30 transition-all font-bold text-sm">
              <Plus size={16} /> New Canvas
            </button>
            {drawings.map(d => (
              <div key={d.id} className="group flex justify-between items-center p-3 rounded-xl hover:bg-[#1e1e2e] border border-transparent hover:border-[#313244] cursor-pointer transition-all" onClick={() => loadDrawing(d)}>
                <span className="text-sm text-white truncate font-medium">{d.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteDrawing(d.id); }}
                  className="text-[#f38ba8] opacity-0 group-hover:opacity-100 hover:bg-[#f38ba8]/20 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {drawings.length === 0 && <div className="text-center text-[#585b70] text-xs py-4">No saved works.</div>}
          </div>
        </TiltCard>
      )}

      {/* CANVAS */}
      <div className="flex-1 bg-[#1e1e2e] rounded-3xl border border-[#313244] overflow-hidden relative cursor-crosshair shadow-inner group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5 pointer-events-none" />
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          className="w-full h-full block"
        />
        <div className="absolute bottom-6 right-6 text-[10px] text-[#585b70] bg-[#1e1e2e]/80 px-3 py-1 rounded-full border border-[#313244] pointer-events-none uppercase tracking-widest font-bold">
            Infinite Canvas V1.0
        </div>
      </div>
    </div>
  );
}