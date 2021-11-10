import React from "react";

// https://material.io/components/banners
const FormErrorBanner = (props) => (
    <div className="mdc-banner" role="banner">
        <div className="mdc-banner__content"
            role="alertdialog"
            aria-live="assertive">
            <div className="mdc-banner__graphic-text-wrapper">
                <div className="mdc-banner__text">
                </div>
            </div>
            <div className="mdc-banner__actions">
                <button type="button" className="mdc-button mdc-banner__primary-action">
                    <div className="mdc-button__ripple"></div>
                    <div className="mdc-button__label">Fix it</div>
                </button>
            </div>
        </div>
    </div>
)

export { FormErrorBanner };