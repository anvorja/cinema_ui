// src/components/admin/movies/MovieModal.tsx
import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Film, Clock, Star, Ticket, CalendarDays, Globe, User2, Tag } from 'lucide-react';
import { getErrorMessage } from '../../../services/api';
import MultipleImageUpload from './MultipleImageUpload';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '../../ui/sheet';
import { Input }    from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label }    from '../../ui/label';
import { Switch }   from '../../ui/switch';
import { Badge }    from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

// ── Constants ──────────────────────────────────────────────────────────────────
const inputCls    = 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus-visible:ring-zinc-600 h-9';
const inputErrCls = 'bg-zinc-800 border-red-500/60 text-white placeholder-zinc-600 focus-visible:ring-red-500/40 h-9';
const selCls      = 'bg-zinc-800 border-zinc-700 text-white h-9 focus:ring-zinc-600';
const contentCls  = 'bg-zinc-900 border-zinc-700 text-white';
const itemCls     = 'text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer';
const labelCls    = 'text-xs text-zinc-400 mb-1.5';

const genres = [
  'Acción','Aventura','Animación','Biografía','Comedia','Crimen',
  'Documental','Drama','Familia','Fantasía','Film-Noir','Historia',
  'Terror','Música','Musical','Misterio','Romance','Ciencia Ficción',
  'Deporte','Thriller','Guerra','Western',
];

const ratings = [
  { value: 'G',     label: 'G — Apta para todos'     },
  { value: 'PG',    label: 'PG — Orientación parental' },
  { value: 'PG-13', label: 'PG-13 — Mayores de 13'   },
  { value: 'R',     label: 'R — Restringida'          },
  { value: 'NC-17', label: 'NC-17 — Solo adultos'     },
];

const statusOptions = [
  { value: 'in_theaters', label: 'En cartelera'  },
  { value: 'coming_soon', label: 'Próximamente'  },
  { value: 'ended',       label: 'Terminada'     },
];

const EMPTY_FORM = {
  title: '', description: '', genre: '', duration: '', rating: '',
  price: '', max_capacity: '', available_tickets: '',
  director: '', country: '', release_date: new Date().toISOString().split('T')[0],
  status: 'in_theaters', is_presale: false,
  theater_ids: [1, 2, 3, 4, 5],
  images: { poster: '', detail1: '', detail2: '', backdrop: '' },
};

// ── Section header helper ──────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }: any) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-zinc-800 rounded-md">
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</p>
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
const MovieModal = ({ movie, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (movie) {
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
      } else {
        setFormData({ ...EMPTY_FORM, release_date: new Date().toISOString().split('T')[0] });
      }
      setErrors({});
      setApiError('');
    }
  }, [movie, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim())                        e.title       = 'Requerido';
    if (!formData.description.trim())                  e.description = 'Requerida';
    else if (formData.description.length > 1000)       e.description = `Máximo 1000 caracteres (${formData.description.length})`;
    if (!formData.genre)                               e.genre       = 'Requerido';
    if (!formData.duration || +formData.duration <= 0) e.duration    = 'Mayor a 0';
    if (!formData.rating)                              e.rating      = 'Requerida';
    if (!formData.price    || +formData.price    <= 0) e.price       = 'Mayor a 0';
    if (!formData.max_capacity || +formData.max_capacity <= 0) e.max_capacity = 'Mayor a 0';
    if (!formData.release_date)                        e.release_date = 'Requerida';
    const missing = (['poster','detail1','detail2','backdrop'] as const).filter(k => !formData.images[k]);
    if (missing.length > 0) e.images = `Faltan: ${missing.join(', ')}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

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
    setLoading(true);
    try {
      await onSave({
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
      });
      setApiError('');
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Completion indicator
  const requiredFields = ['title','description','genre','duration','rating','price','max_capacity','release_date'];
  const filled = requiredFields.filter(f => formData[f]?.toString().trim()).length;
  const imagesOk = (['poster','detail1','detail2','backdrop'] as const).filter(k => formData.images[k]).length;
  const totalSteps = requiredFields.length + 4;
  const totalFilled = filled + imagesOk;
  const pct = Math.round((totalFilled / totalSteps) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[680px] bg-zinc-950 border-zinc-800 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
              <Film className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-white text-base">
                {movie ? 'Editar película' : 'Nueva película'}
              </SheetTitle>
              <SheetDescription className="text-zinc-500 text-xs mt-0.5">
                {movie ? movie.title : 'Completa los campos para agregar una película a la cartelera'}
              </SheetDescription>
            </div>
            {/* Completion pill */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[10px] font-medium ${pct === 100 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {pct}%
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-8">

            {/* ── Sección 1: Imágenes ──────────────────────────────── */}
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
                <p className="text-[11px] text-red-400 -mt-2">{errors.images}</p>
              )}
            </Section>

            <div className="border-t border-zinc-800" />

            {/* ── Sección 2: Identidad ─────────────────────────────── */}
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

              <div className="grid grid-cols-2 gap-4">
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

                <Field label="Director" error={errors.director}>
                  <Input
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    placeholder="Nombre del director"
                    className={inputCls}
                  />
                </Field>

                <Field label="País" error={errors.country}>
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
                    rows={4}
                    maxLength={1000}
                    className={`resize-none bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus-visible:ring-zinc-600 ${errors.description ? 'border-red-500/60' : ''}`}
                  />
                  <span className={`absolute bottom-2 right-2.5 text-[10px] ${
                    formData.description.length > 950 ? 'text-red-400' :
                    formData.description.length > 800 ? 'text-amber-400' : 'text-zinc-700'
                  }`}>
                    {formData.description.length}/1000
                  </span>
                </div>
              </Field>
            </Section>

            <div className="border-t border-zinc-800" />

            {/* ── Sección 3: Clasificación y tiempo ───────────────── */}
            <Section icon={Star} title="Clasificación y tiempo">
              <div className="grid grid-cols-2 gap-4">
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
                    className={`${errors.release_date ? inputErrCls : inputCls} [color-scheme:dark]`}
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

            <div className="border-t border-zinc-800" />

            {/* ── Sección 4: Disponibilidad ────────────────────────── */}
            <Section icon={Ticket} title="Disponibilidad">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio (COP)" required error={errors.price}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">$</span>
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

                {/* Presale toggle */}
                <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg col-span-2">
                  <div>
                    <p className="text-sm text-white">Preventa activa</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">La película se mostrará como preventa</p>
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
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* API Error */}
            {apiError && (
              <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/40 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{apiError}</p>
              </div>
            )}

            {/* Bottom padding so footer doesn't cover last field */}
            <div className="h-2" />
          </div>
        </form>

        {/* Sticky footer */}
        <div className="shrink-0 px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="movie-form"
            onClick={handleSubmit}
            disabled={loading}
            className="h-9 px-6 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && <Loader className="h-3.5 w-3.5 animate-spin" />}
            {movie ? 'Guardar cambios' : 'Crear película'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MovieModal;
