import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ClipboardCheck, 
  Trophy, 
  Settings, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  BarChart3,
  Home as HomeIcon
} from 'lucide-react';

// --- Types ---
interface Pregunta {
  id: number;
  tema: string;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  correcta: string;
}

interface Tema {
  tema: string;
  total: number;
}

// --- Components ---

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <ClipboardCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">OPO INGESA</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/temas')
      .then(res => res.json())
      .then(data => {
        setTemas(data.temas);
        setTotalGeneral(data.totalGeneral);
        setLoading(false);
      });
  }, []);

  const startExam = (tema: string, cantidad: number = 20) => {
    navigate(`/exam?tema=${encodeURIComponent(tema)}&cantidad=${cantidad}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <BookOpen className="text-emerald-600 animate-bounce" />
        </div>
        <p className="text-stone-400 font-medium">Cargando temas...</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Prepárate para tu examen</h1>
        <p className="text-stone-500 text-lg max-w-2xl">
          Selecciona un tema específico o realiza un examen general con preguntas aleatorias de toda la base de datos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* General Exam Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-900/10 cursor-pointer group relative overflow-hidden"
          onClick={() => startExam('GENERAL', 20)}
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Examen General</h2>
            <p className="text-emerald-50/80 mb-6 text-sm">
              20 preguntas aleatorias de todos los temas disponibles ({totalGeneral} preguntas en total).
            </p>
            <div className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
              Comenzar ahora <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Theme Cards */}
        {temas.map((t, idx) => (
          <motion.div 
            key={t.tema}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => startExam(t.tema)}
          >
            <div className="bg-stone-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
              <BookOpen className="w-5 h-5 text-stone-500 group-hover:text-emerald-600" />
            </div>
            <h3 className="font-bold text-stone-900 mb-1 line-clamp-2 h-12">{t.tema}</h3>
            <p className="text-stone-400 text-xs mb-6">{t.total} preguntas disponibles</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Practicar</span>
              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Exam = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tema = params.get('tema') || 'GENERAL';
    const cantidad = params.get('cantidad') || '20';
    
    fetch(`/api/preguntas?tema=${encodeURIComponent(tema)}&cantidad=${cantidad}`)
      .then(res => res.json())
      .then(data => {
        setPreguntas(data);
        setLoading(false);
      });
  }, [location]);

  const handleSelect = (option: string) => {
    setRespuestas({ ...respuestas, [preguntas[currentIdx].id]: option });
  };

  const next = () => {
    if (currentIdx < preguntas.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const finish = () => {
    setFinished(true);
  };

  if (loading) return <div className="p-8 text-center">Cargando examen...</div>;
  if (preguntas.length === 0) return <div className="p-8 text-center">No hay preguntas disponibles.</div>;

  if (finished) {
    const score = preguntas.reduce((acc, p) => {
      return acc + (respuestas[p.id] === p.correcta ? 1 : 0);
    }, 0);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-12 text-center"
      >
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-stone-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-emerald-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">¡Examen Finalizado!</h2>
          <p className="text-stone-500 mb-8">Has completado todas las preguntas.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-stone-50 p-6 rounded-2xl">
              <p className="text-stone-400 text-sm mb-1">Aciertos</p>
              <p className="text-4xl font-bold text-emerald-600">{score}</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-2xl">
              <p className="text-stone-400 text-sm mb-1">Total</p>
              <p className="text-4xl font-bold text-stone-900">{preguntas.length}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/', { state: { results: { score, total: preguntas.length, preguntas, respuestas } } })}
              className="bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              Volver al inicio
            </button>
            <button 
              onClick={() => navigate('/results', { state: { preguntas, respuestas } })}
              className="bg-stone-100 text-stone-700 py-4 rounded-xl font-bold hover:bg-stone-200 transition-colors"
            >
              Ver corrección detallada
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = preguntas[currentIdx];
  const progress = ((currentIdx + 1) / preguntas.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Pregunta {currentIdx + 1} de {preguntas.length}</span>
          <span className="text-xs font-bold text-emerald-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-600"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100"
        >
          <p className="text-stone-400 text-xs font-bold mb-2 uppercase tracking-tight">{q.tema}</p>
          <h2 className="text-xl font-bold text-stone-900 mb-8 leading-relaxed">{q.pregunta}</h2>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((opt) => {
              const label = q[`opcion_${opt}` as keyof Pregunta];
              const isSelected = respuestas[q.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900' 
                      : 'border-stone-100 hover:border-stone-200 text-stone-600'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {opt.toUpperCase()}
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button 
          onClick={prev}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 text-stone-400 font-bold hover:text-stone-900 disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Anterior
        </button>
        <button 
          onClick={next}
          className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          {currentIdx === preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { preguntas, respuestas } = location.state || { preguntas: [], respuestas: {} };

  if (!preguntas.length) return <div className="p-8 text-center">No hay resultados para mostrar.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Corrección</h1>
        <button 
          onClick={() => navigate('/')}
          className="text-stone-500 hover:text-stone-900 font-bold flex items-center gap-2"
        >
          <HomeIcon className="w-4 h-4" /> Inicio
        </button>
      </div>

      <div className="space-y-6">
        {preguntas.map((q: Pregunta, idx: number) => {
          const userAns = respuestas[q.id];
          const isCorrect = userAns === q.correcta;
          
          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="text-xs font-bold text-stone-400 uppercase mb-1 block">Pregunta {idx + 1}</span>
                  <p className="font-bold text-stone-900">{q.pregunta}</p>
                </div>
                {isCorrect ? (
                  <CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" />
                ) : (
                  <XCircle className="text-rose-500 w-6 h-6 shrink-0" />
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {['a', 'b', 'c', 'd'].map((opt) => {
                  const label = q[`opcion_${opt}` as keyof Pregunta];
                  const isCorrectOpt = opt === q.correcta;
                  const isUserOpt = opt === userAns;
                  
                  let bgClass = 'bg-stone-50 text-stone-500';
                  let borderClass = 'border-transparent';
                  
                  if (isCorrectOpt) {
                    bgClass = 'bg-emerald-50 text-emerald-700';
                    borderClass = 'border-emerald-200';
                  } else if (isUserOpt && !isCorrect) {
                    bgClass = 'bg-rose-50 text-rose-700';
                    borderClass = 'border-rose-200';
                  }

                  return (
                    <div key={opt} className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${bgClass} ${borderClass}`}>
                      <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        isCorrectOpt ? 'bg-emerald-600 text-white' : isUserOpt ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-400'
                      }`}>
                        {opt.toUpperCase()}
                      </span>
                      <span className="flex-1">{label}</span>
                      {isCorrectOpt && <CheckCircle2 className="w-4 h-4" />}
                      {isUserOpt && !isCorrect && <XCircle className="w-4 h-4" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Admin = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [formData, setFormData] = useState({
    tema: '',
    pregunta: '',
    opcion_a: '',
    opcion_b: '',
    opcion_c: '',
    opcion_d: '',
    correcta: 'a'
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/temas')
      .then(res => res.json())
      .then(data => setTemas(data.temas));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Pregunta añadida correctamente' });
        setFormData({ ...formData, pregunta: '', opcion_a: '', opcion_b: '', opcion_c: '', opcion_d: '' });
        // Refresh themes
        const data = await fetch('/api/temas').then(r => r.json());
        setTemas(data.temas);
      } else {
        setStatus({ type: 'error', msg: 'Error al añadir la pregunta' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Error de conexión' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-stone-900 p-2 rounded-lg">
              <Plus className="text-white w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Añadir Pregunta</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-500 mb-2">Tema</label>
              <input 
                list="temas-list"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.tema}
                onChange={e => setFormData({ ...formData, tema: e.target.value })}
                placeholder="Selecciona o escribe un tema"
              />
              <datalist id="temas-list">
                {temas.map(t => <option key={t.tema} value={t.tema} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-2">Enunciado de la pregunta</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                value={formData.pregunta}
                onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map(opt => (
                <div key={opt}>
                  <label className="block text-xs font-bold text-stone-400 mb-1 uppercase">Opción {opt.toUpperCase()}</label>
                  <input 
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData[`opcion_${opt}` as keyof typeof formData]}
                    onChange={e => setFormData({ ...formData, [`opcion_${opt}`]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-500 mb-2">Opción Correcta</label>
              <div className="flex gap-4">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, correcta: opt })}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      formData.correcta === opt 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
            >
              Guardar Pregunta
            </button>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-medium">{status.msg}</span>
              </motion.div>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <BarChart3 className="text-emerald-600 w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif font-bold">Estadísticas</h2>
          </div>
          <div className="space-y-4">
            {temas.map(t => (
              <div key={t.tema} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                <span className="text-sm text-stone-600 font-medium truncate flex-1 pr-4">{t.tema}</span>
                <span className="bg-stone-100 px-2 py-1 rounded text-xs font-bold text-stone-500">{t.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/results" element={<Results />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="py-12 border-t border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-stone-400 text-sm font-medium">© 2024 OPO INGESA Test Platform. Diseñado para opositores.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
