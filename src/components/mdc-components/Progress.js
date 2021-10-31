import React from "react";

const LinearProgress = (props) => (
    <div role="progressbar" className="mdc-linear-progress" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
        <div className="mdc-linear-progress__buffer">
            <div className="mdc-linear-progress__buffer-bar"></div>
            <div className="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span className="mdc-linear-progress__bar-inner"></span>
        </div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span className="mdc-linear-progress__bar-inner"></span>
        </div>
    </div>
)

export { LinearProgress };