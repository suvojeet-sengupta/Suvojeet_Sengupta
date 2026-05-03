'use client';

import React from 'react';
import styles from './Vinyl.module.css';

interface VinylProps {
  nowPlaying?: string;
}

const Vinyl = ({ nowPlaying = 'Tum Hi Ho (Cover)' }: VinylProps) => (
  <div className={styles.vinylWrap}>
    <div className={styles.vinyl}>
      <div className={styles.vinylLabel}>
        <div className={styles.vinylLabelInner}>
          SS
          <small>EST 2005</small>
        </div>
      </div>
      <div className={styles.vinylCenter} />
    </div>
    <div className={styles.vinylArm} aria-hidden="true" />
    <div className={styles.trackMeta}>
      Now Spinning · <span>{nowPlaying}</span> · 33⅓ RPM
    </div>
  </div>
);

export default Vinyl;
