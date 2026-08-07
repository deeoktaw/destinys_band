import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BgMark } from './components/BgMark';
import { PlayerBar } from './components/PlayerBar';
import type { Album, Catalog, Track } from './types';

const TG_URL = 'https://t.me/WonderAcoustic';
// VK: добавить ссылку позже

function resolveSrc(src: string): string {
  const base = import.meta.env.BASE_URL || './';
  if (/^https?:\/\//i.test(src)) return src;
  const cleaned = src.replace(/^\.\//, '').replace(/^\//, '');
  return `${base}${cleaned}`;
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Track[]>([]);
  const indexRef = useRef(-1);

  const playAt = useCallback((index: number) => {
    const queue = queueRef.current;
    const track = queue[index];
    const audio = audioRef.current;
    if (!track || !audio) return;

    indexRef.current = index;
    setTrackId(track.id);
    audio.src = resolveSrc(track.src);
    void audio.play().catch(() => setPlaying(false));
  }, []);

  const playAtRef = useRef(playAt);
  playAtRef.current = playAt;

  useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}catalog.json`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Не удалось загрузить каталог (${res.status})`);
        return res.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        const first = data.albums.find((a) => a.tracks.length > 0) ?? data.albums[0];
        if (first) setAlbumId(first.id);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onEnded = () => {
      const queue = queueRef.current;
      const next = indexRef.current + 1;
      if (next < queue.length) {
        playAtRef.current(next);
      } else {
        setPlaying(false);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const albums = catalog?.albums ?? [];
  const album: Album | null = useMemo(
    () => albums.find((a) => a.id === albumId) ?? null,
    [albums, albumId],
  );

  useEffect(() => {
    queueRef.current = album?.tracks ?? [];
  }, [album]);

  const currentTrack = useMemo(() => {
    if (!trackId) return null;
    for (const a of albums) {
      const t = a.tracks.find((x) => x.id === trackId);
      if (t) return { track: t, album: a };
    }
    return null;
  }, [albums, trackId]);

  const selectAlbum = (id: string) => {
    setAlbumId(id);
  };

  const playTrack = (index: number) => {
    if (album) queueRef.current = album.tracks;
    playAt(index);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    if (trackId && audio.src) {
      void audio.play().catch(() => setPlaying(false));
      return;
    }

    const queue = queueRef.current;
    if (queue.length > 0) playAt(0);
  };

  const playNext = () => {
    const queue = queueRef.current;
    if (queue.length === 0) return;
    const next = indexRef.current < 0 ? 0 : indexRef.current + 1;
    if (next < queue.length) {
      playAt(next);
    } else {
      playAt(0);
    }
  };

  if (error) {
    return <div className="status-msg error">{error}</div>;
  }

  if (!catalog) {
    return <div className="status-msg">Загрузка…</div>;
  }

  const trackCount = album?.tracks.length ?? 0;
  const canPlay = trackCount > 0 || Boolean(trackId);
  const canNext = trackCount > 1;

  return (
    <>
      <BgMark />
      <div className="app">
        <header className="site-header">
          <div className="brand">
            <span className="name">Broad Jump</span>
            <span className="tag">Радио и альбомы</span>
          </div>
          <nav className="header-links" aria-label="Соцсети">
            <a href={TG_URL} target="_blank" rel="noreferrer">
              Telegram
            </a>
            {/* VK: placeholder — добавить ссылку позже */}
          </nav>
        </header>

        <main className="main">
          <h2 className="section-title">Альбомы</h2>
          <p className="section-note">Выберите направление, затем трек — радио продолжит само.</p>

          <div className="album-grid" role="list">
            {albums.map((a) => (
              <button
                key={a.id}
                type="button"
                role="listitem"
                className={`album-card${a.id === albumId ? ' active' : ''}`}
                onClick={() => selectAlbum(a.id)}
                aria-pressed={a.id === albumId}
              >
                <span>
                  <span className="title">{a.title}</span>
                  {a.note ? <span className="meta">{a.note}</span> : null}
                </span>
                <span className="count">{a.tracks.length}</span>
              </button>
            ))}
          </div>

          {album ? (
            <>
              <h2 className="section-title">{album.title}</h2>
              {album.note ? <p className="section-note">{album.note}</p> : null}

              {album.tracks.length === 0 ? (
                <div className="empty-album">Пока без треков — скоро появятся.</div>
              ) : (
                <ul className="track-list">
                  {album.tracks.map((t, i) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        className={`track-row${t.id === trackId ? ' active' : ''}`}
                        onClick={() => playTrack(i)}
                      >
                        <span className="num">{i + 1}</span>
                        <span className="t-title">{t.title}</span>
                        <span className="playing-dot" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}
        </main>

        <footer className="site-footer">
          <div>
            Broad Jump ·{' '}
            <a href={TG_URL} target="_blank" rel="noreferrer">
              @WonderAcoustic
            </a>
          </div>
          {/* VK: placeholder — добавить ссылку позже */}
        </footer>

        <PlayerBar
          trackTitle={currentTrack?.track.title ?? null}
          albumTitle={currentTrack?.album.title ?? album?.title ?? null}
          playing={playing}
          canPlay={canPlay}
          canNext={canNext}
          onToggle={togglePlay}
          onNext={playNext}
        />
      </div>
    </>
  );
}
