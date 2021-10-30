import React from "react";

const GeneralSnackBar = () => (
    <div>
        <aside className="mdc-snackbar">
            <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div className="mdc-snackbar__label" aria-atomic="false"></div>
                <div className="mdc-snackbar__actions" aria-atomic="true">
                    <button type="button" className="mdc-button mdc-snackbar__action">
                        <span className="mdc-button__label">Close</span>
                    </button>
                    {/* to-do: why the close button is off center? */}
                    {/* <button type="button" className="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss">close</button> */}
                </div>
            </div>
        </aside>
    </div>
)

const RegisterSnackBar = (props) => (
    <div>
        <aside className="mdc-snackbar mdc-warning">
            <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div className="mdc-snackbar__label" aria-atomic="false">
                    {props.value ? props.value : "null"}
                </div>
                <div className="mdc-snackbar__actions" aria-atomic="true">
                    <button type="button" className="mdc-button mdc-snackbar__action">
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">Close</span>
                    </button>
                    {/* <button type="button" className="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss">close</button> */}
                </div>
            </div>
        </aside>
    </div>
)

export { GeneralSnackBar, RegisterSnackBar };
