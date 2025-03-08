import React from 'react';

const Toast = ({ show, message }) => {
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
      <div className={`toast ${show ? 'show' : 'fade'}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">Bootstrap</strong>
          <small className="text-body-secondary">11 mins ago</small>
          <button type="button" className="btn ms-2 p-0" data-bs-dismiss="toast" aria-label="Close">
            <span className="uil uil-times fs-7"></span>
          </button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
