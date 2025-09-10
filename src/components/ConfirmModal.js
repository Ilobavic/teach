import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './ConfirmModal.css';

export default function ConfirmModal() {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState({});
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    function handler(e) {
      const detail = e.detail || {};
      setOpts(detail);
      setVisible(true);
      setLeaving(false);
    }

    window.addEventListener('showConfirm', handler);
    return () => window.removeEventListener('showConfirm', handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!visible) return;
      if (e.key === 'Escape') {
        // close without needing external function ref
        setLeaving(true);
        setTimeout(() => {
          setVisible(false);
          setLeaving(false);
          if (typeof opts.onCancel === 'function') opts.onCancel();
        }, 400);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, opts]);

  if (!visible) return null;

  const title = opts.title || 'Confirm';
  const message = opts.message || 'Are you sure?';
  const confirmText = opts.confirmText || 'Yes';
  const cancelText = opts.cancelText || 'Cancel';
  const styleMode = opts.styleMode || 'dark';
  const onConfirm = typeof opts.onConfirm === 'function' ? opts.onConfirm : () => {};
  const onCancel = typeof opts.onCancel === 'function' ? opts.onCancel : () => {};
  const cancelClass = `btn ${styleMode === 'dark' ? 'btn-outline-light' : 'btn-outline-secondary'} cp-btn-cancel`;

  function finishAndClose(cb) {
    setLeaving(true);
    // animation duration 380ms matches CSS
    setTimeout(() => {
      setVisible(false);
      setLeaving(false);
      cb();
    }, 400);
  }

  function doConfirm() {
    finishAndClose(() => onConfirm());
  }
  function doCancel() {
    finishAndClose(() => onCancel());
  }

  return ReactDOM.createPortal(
    <div className={`cp-confirm-root ${leaving ? 'leaving' : ''}`}>
      <div className={`cp-overlay ${styleMode}`}></div>
      <div className={`cp-dialog ${styleMode} ${leaving ? 'scale-out' : 'scale-in'}`} role="dialog" aria-modal>
        <div className="cp-dialog-body">
          <div className="cp-dialog-title">{title}</div>
          <div className="cp-dialog-message">{message}</div>
          <div className="cp-dialog-actions">
            <button className={cancelClass} onClick={doCancel}>{cancelText}</button>
            <button className={`btn cp-btn-confirm ${styleMode === 'dark' ? 'btn-danger' : 'btn-primary'}`} onClick={doConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
