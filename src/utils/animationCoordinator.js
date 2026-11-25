/**
 * Shared Animation Coordinator for DEVVERSE.
 * Ensures BombCharacterStage and EnvelopeCourierOverlay never collide, overlap,
 * queue up duplicate timers, or intersect during movement, scrolling, or resizing.
 */

const reservations = new Map();

export function rectsIntersect(a, b, padding = 24) {
  if (!a || !b) return false;
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

/**
 * Attempts to acquire an exclusive/non-overlapping animation reservation.
 * Returns true if acquired, false if another animation is active or its reserved area overlaps.
 */
export function tryAcquireAnimation(id, rect, durationMs) {
  const now = Date.now();

  // Prune any stale reservations whose safety deadline has passed
  for (const [key, res] of reservations.entries()) {
    if (res.expiresAt <= now) {
      reservations.delete(key);
    }
  }

  for (const [otherId, other] of reservations.entries()) {
    if (otherId === id) continue;
    // Prevent simultaneous overlap: if the other animation is active, block unless non-intersecting
    // and even then, if either is full-question-stage, strictly serialize them.
    if (other.active) {
      if (id === 'bomb-stage' || otherId === 'bomb-stage') {
        return false;
      }
      if (rectsIntersect(rect, other.rect, 28)) {
        return false;
      }
    }
  }

  reservations.set(id, {
    id,
    active: true,
    rect: rect || { left: 0, top: 0, right: 0, bottom: 0 },
    startedAt: now,
    expiresAt: now + durationMs + 500,
  });

  return true;
}

export function updateAnimationRect(id, rect) {
  const current = reservations.get(id);
  if (current && rect) {
    current.rect = rect;
  }
}

export function releaseAnimation(id) {
  reservations.delete(id);
}

export function getActiveReservation(id) {
  const res = reservations.get(id);
  if (!res) return null;
  if (res.expiresAt <= Date.now()) {
    reservations.delete(id);
    return null;
  }
  return res;
}

export function isAnyOtherAnimationActive(selfId) {
  const now = Date.now();
  for (const [key, res] of reservations.entries()) {
    if (key !== selfId && res.active && res.expiresAt > now) {
      return true;
    }
  }
  return false;
}
