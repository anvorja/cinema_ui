// src/components/admin/movies/MovieEditPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Film, Loader, AlertCircle, Star, Ticket, Tag } from 'lucide-react';
import { getErrorMessage } from '../../../services/api';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import MultipleImageUpload from './MultipleImageUpload';
import { Input }    from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label }    from '../../ui/label';
import { Switch }   from '../../ui/switch';
import { Badge }    from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

// ── Constants ──────────────────────────────────────────────────────────────────
const inputCls    = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus-visible:ring-gray-300 dark:focus-visible:ring-zinc-600 h-9';
const inputErrCls = 'bg-white dark:bg-zinc-800 border-red-500/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus-visible:ring-red-500/40 h-9';
const selCls      = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white h-9 focus:ring-gray-300 dark:focus:ring-zinc-600';
const contentCls  = 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white';
const itemCls     = 'text-gray-700 dark:text-zinc-300 focus:bg-gray-100 dark:focus:bg-zinc-800 focus:text-gray-900 dark:focus:text-white cursor-pointer';
const labelCls    = 'text-xs text-gray-500 dark:text-zinc-400 mb-1.5';

const genres = [
  'Acción','Aventura','Animación','Biografía','Comedia','Crimen',
  'Documental','Drama','Familia','Fantasía','Film-Noir','Historia',
  'Terror','Música','Musical','Misterio','Romance','Ciencia Ficción',
  'Deporte','Thriller','Guerra','Western',
];

const ratings = [
  { value: 'G',     label: 'G — Apta para todos'       },
  { value: 'PG',    label: 'PG — Orientación parental'  },
  { value: 'PG-13', label: 'PG-13 — Mayores de 13'     },
  { value: 'R',     label: 'R — Restringida'            },
  { value: 'NC-17', label: 'NC-17 — Solo adultos'       },
];

const statusOptions = [
  { value: 'in_theaters', label: 'En cartelera' },
  { value: 'coming_soon', label: 'Próximamente' },
  { value: 'ended',       label: 'Terminada'    },
];

const EMPTY_FORM = {
  title: '', description: '', genre: '', duration: '', rating: '',
  price: '', max_capacity: '', available_tickets: '',
  director: '', country: '', release_date: new Date().toISOString().split('T')[0],
  status: 'in_theaters', is_presale: false,
  theater_ids: [1, 2, 3, 4, 5],
  images: { poster: '', detail1: '', detail2: '', backdrop: '' },
};

// ── Section header ─────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }: any) => (
  <div className="space-y-5">
    <div className="flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-zinc-800">
      <div className="p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-md">
        <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-400" />
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">{title}</p>
    </div>
    {children}
  </div>
);

// ── Field wrapper ──────────────────────────────────────────────────────────────
const Field = ({ label, error, required = false, children }: any) => (
  <div className="space-y-1.5">
    <Label className={`${labelCls} ${error ? 'text-red-400' : ''}`}>
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </Label>
    {children}
    {error && <p className="text-[11px] text-red-400">{error}</p>}
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const MovieEditPage = () => {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const location     = useLocation();
  const { adminApi } = useApi();
  const { toast }    = useToast();

  const isEdit = Boolean(id);

  const [formData,    setFormData]    = useState({ ...EMPTY_FORM });
  const [saving,      setSaving]      = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [apiError,    setApiError]    = useState('');
  const [movieTitle,  setMovieTitle]  = useState('');

  // ── Load movie data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;

    // Fast path: movie passed via navigation state (from the grid)
    const stateMovie = (location.state as any)?.movie;
    if (stateMovie) {
      populateForm(stateMovie);
      setMovieTitle(stateMovie.title || '');
      setPageLoading(false);
      return;
    }

    // Slow path: fetch by ID (direct URL / bookmark)
    adminApi.getMovie(id!).then((movie: any) => {
      populateForm(movie);
      setMovieTitle(movie.title || '');
    }).catch(() => {
      toast.error('No se pudo cargar la película', { title: 'Error' });
      navigate('/admin');
    }).finally(() => setPageLoading(false));
  }, [id]); // eslint-disable-line

  const populateForm = (movie: any) => {
    setFormData({
      title:             movie.title            || '',
      description:       movie.description      || '',
      genre:             movie.genre            || '',
      duration:          movie.duration         || '',
      rating:            movie.rating           || '',
      price:             movie.price            || '',
      max_capacity:      movie.max_capacity     || '',
      available_tickets: movie.available_tickets ?? movie.max_capacity ?? '',
      director:          movie.director         || '',
      country:           movie.country          || '',
      release_date:      movie.release_date     || new Date().toISOString().split('T')[0],
      status:            movie.status           || 'in_theaters',
      is_presale:        movie.is_presale       || false,
      theater_ids:       movie.theater_ids      || [1, 2, 3, 4, 5],
      images: {
        poster:   movie.poster_url   || '',
        detail1:  movie.detail_1_url || '',
        detail2:  movie.detail_2_url || '',
        backdrop: movie.backdrop_url || '',
      },
    });
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim())                              e.title        = 'Requerido';
    if (!formData.description.trim())                        e.description  = 'Requerida';
    else if (formData.description.length > 1000)             e.description  = `Máximo 1000 caracteres (${formData.description.length})`;
    if (!formData.genre)                                     e.genre        = 'Requerido';
    if (!formData.duration || +formData.duration <= 0)       e.duration     = 'Mayor a 0';
    if (!formData.rating)                                    e.rating       = 'Requerida';
    if (!formData.price    || +formData.price    <= 0)       e.price        = 'Mayor a 0';
    if (!formData.max_capacity || +formData.max_capacity <= 0) e.max_capacity = 'Mayor a 0';
    if (!formData.release_date)                              e.release_date = 'Requerida';
    const missingImgs = (['poster','detail1','detail2','backdrop'] as const).filter(k => !formData.images[k]);
    if (missingImgs.length) e.images = `Faltan: ${missingImgs.join(', ')}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'max_capacity' ? { available_tickets: value } : {}),
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelect = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      const payload = {
        title:             formData.title.trim(),
        description:       formData.description.trim(),
        genre:             formData.genre,
        duration:          parseInt(formData.duration),
        rating:            formData.rating,
        price:             parseFloat(formData.price),
        max_capacity:      parseInt(formData.max_capacity),
        available_tickets: parseInt(formData.available_tickets || formData.max_capacity),
        director:          formData.director.trim() || null,
        country:           formData.country.trim()  || null,
        release_date:      formData.release_date,
        status:            formData.status,
        is_presale:        formData.is_presale,
        theater_ids:       formData.theater_ids,
        poster_url:        formData.images.poster,
        detail_1_url:      formData.images.detail1,
        detail_2_url:      formData.images.detail2,
        backdrop_url:      formData.images.backdrop,
      };

      if (isEdit) {
        await adminApi.updateMovie(id!, payload);
        toast.success(`"${payload.title}" actualizada`, { title: 'Película actualizada' });
      } else {
        await adminApi.createMovie(payload);
        toast.success(`"${payload.title}" creada exitosamente`, { title: 'Película creada' });
      }
      navigate('/admin');
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ── Completion indicator ──────────────────────────────────────────────────────
  const requiredFields = ['title','description','genre','duration','rating','price','max_capacity','release_date'];
  const filledFields   = requiredFields.filter(f => (formData as any)[f]?.toString().trim()).length;
  const imagesOk       = (['poster','detail1','detail2','backdrop'] as const).filter(k => formData.images[k]).length;
  const pct = Math.round(((filledFields + imagesOk) / (requiredFields.length + 4)) * 100);

  // ── Render ───────────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400 dark:text-zinc-500">Cargando película...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">

      {/* ── Top bar ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Películas</span>
          </button>

          <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700 shrink-0" />

          {/* Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-md shrink-0">
              <Film className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <h1 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {isEdit
                ? (movieTitle ? `Editar: ${movieTitle}` : 'Editar película')
                : 'Nueva película'}
            </h1>
          </div>

          {/* Progress + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[11px] font-medium tabular-nums ${pct === 100 ? 'text-emerald-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                {pct}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="h-8 px-3 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="movie-edit-form"
              disabled={saving}
              className="h-8 px-4 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {saving && <Loader className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Crear película'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form id="movie-edit-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* ── Left column: form sections ──────────────────────────────────── */}
            <div className="space-y-8">

              {/* Identidad */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                <Section icon={Tag} title="Identidad">
                  <Field label="Título" required error={errors.title}>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Título de la película"
                      className={errors.title ? inputErrCls : inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Género" required error={errors.genre}>
                      <Select value={formData.genre} onValueChange={v => handleSelect('genre', v)}>
                        <SelectTrigger className={`${selCls} ${errors.genre ? 'border-red-500/60' : ''}`}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className={contentCls}>
                          {genres.map(g => <SelectItem key={g} value={g} className={itemCls}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Director">
                      <Input
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        placeholder="Nombre del director"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="País">
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Ej: Colombia, EE.UU."
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Descripción" required error={errors.description}>
                    <div className="relative">
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Sinopsis de la película..."
                        rows={5}
                        maxLength={1000}
                        className={`resize-none bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus-visible:ring-gray-300 dark:focus-visible:ring-zinc-600 ${errors.description ? 'border-red-500/60' : ''}`}
                      />
                      <span className={`absolute bottom-2 right-2.5 text-[10px] ${
                        formData.description.length > 950 ? 'text-red-400' :
                        formData.description.length > 800 ? 'text-amber-400' : 'text-gray-300 dark:text-zinc-700'
                      }`}>
                        {formData.description.length}/1000
                      </span>
                    </div>
                  </Field>
                </Section>
              </div>

              {/* Clasificación y tiempo */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                <Section icon={Star} title="Clasificación y tiempo">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Clasificación" required error={errors.rating}>
                      <Select value={formData.rating} onValueChange={v => handleSelect('rating', v)}>
                        <SelectTrigger className={`${selCls} ${errors.rating ? 'border-red-500/60' : ''}`}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className={contentCls}>
                          {ratings.map(r => <SelectItem key={r.value} value={r.value} className={itemCls}>{r.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Duración (min)" required error={errors.duration}>
                      <Input
                        name="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="120"
                        className={errors.duration ? inputErrCls : inputCls}
                      />
                    </Field>

                    <Field label="Fecha de estreno" required error={errors.release_date}>
                      <Input
                        name="release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={handleChange}
                        className={`${errors.release_date ? inputErrCls : inputCls} dark:[color-scheme:dark]`}
                      />
                    </Field>

                    <Field label="Estado en cartelera">
                      <Select value={formData.status} onValueChange={v => handleSelect('status', v)}>
                        <SelectTrigger className={selCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={contentCls}>
                          {statusOptions.map(o => <SelectItem key={o.value} value={o.value} className={itemCls}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </Section>
              </div>

              {/* Disponibilidad */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                <Section icon={Ticket} title="Disponibilidad">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Precio (COP)" required error={errors.price}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-zinc-500">$</span>
                        <Input
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="18000"
                          className={`pl-6 ${errors.price ? inputErrCls : inputCls}`}
                        />
                      </div>
                    </Field>

                    <Field label="Capacidad máxima" required error={errors.max_capacity}>
                      <Input
                        name="max_capacity"
                        type="number"
                        min="1"
                        value={formData.max_capacity}
                        onChange={handleChange}
                        placeholder="100"
                        className={errors.max_capacity ? inputErrCls : inputCls}
                      />
                    </Field>

                    <Field label="Tickets disponibles">
                      <Input
                        name="available_tickets"
                        type="number"
                        min="0"
                        value={formData.available_tickets}
                        onChange={handleChange}
                        placeholder="100"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* Presale toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-lg mt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Preventa activa</p>
                      <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">La película se mostrará como preventa</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.is_presale && (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">
                          Preventa
                        </Badge>
                      )}
                      <Switch
                        checked={formData.is_presale}
                        onCheckedChange={v => setFormData(prev => ({ ...prev, is_presale: v }))}
                        className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-zinc-700"
                      />
                    </div>
                  </div>
                </Section>
              </div>

              {/* API error */}
              {apiError && (
                <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/40 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-500 dark:text-red-300 text-sm">{apiError}</p>
                </div>
              )}
            </div>

            {/* ── Right column: images (sticky) ───────────────────────────────── */}
            <div className="lg:sticky lg:top-[65px]">
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                <Section icon={Film} title="Imágenes">
                  <MultipleImageUpload
                    onImagesChange={imgs => {
                      setFormData(prev => ({ ...prev, images: imgs }));
                      if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
                    }}
                    currentImages={formData.images}
                    movieTitle={formData.title}
                  />
                  {errors.images && (
                    <p className="text-[11px] text-red-400">{errors.images}</p>
                  )}
                </Section>
              </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
};

export default MovieEditPage;
