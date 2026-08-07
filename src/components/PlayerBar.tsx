import { IconNext, IconPause, IconPlay } from './icons';

type Props = {
  trackTitle: string | null;
  albumTitle: string | null;
  playing: boolean;
  canPlay: boolean;
  canNext: boolean;
  onToggle: () => void;
  onNext: () => void;
};

export function PlayerBar({
  trackTitle,
  albumTitle,
  playing,
  canPlay,
  canNext,
  onToggle,
  onNext,
}: Props) {
  return (
    <div className="player-bar" role="region" aria-label="Плеер">
      <div className="player-info">
        <span className="now">Сейчас</span>
        <span className="track-name">{trackTitle ?? 'Выберите трек'}</span>
        {albumTitle ? <span className="album-name">{albumTitle}</span> : null}
      </div>
      <div className="player-controls">
        <button
          type="button"
          className="player-btn primary"
          onClick={onToggle}
          disabled={!canPlay}
          aria-label={playing ? 'Пауза' : 'Играть'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>
        <button
          type="button"
          className="player-btn"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Следующий трек"
        >
          <IconNext />
        </button>
      </div>
    </div>
  );
}
