import React from "react";
import ReactDom from "react-dom"
import DetailBarang from "./DetailBarang";

const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "50px",
    zIndex: 2000
}

const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .2)",
    opacity: "50%",
    zIndex: 2000
    // position: 'fixed',
    // top: '0',
    // left: '0',
    // width: '100%',
    // height: '100%',
    // background: 'rgba(100, 88, 88, 0.5)',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // zIndex: '9999',
}

export default function ModalDetail({barangId ,open, onClose}) {
    if(!open) return null;

    return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES}/>
        <div style={MODAL_STYLES}>
            <DetailBarang barangId={barangId}/>
            <button class="btn btn-danger" onClick={onClose}>Tutup</button>
        </div>
        </>,
        document.getElementById("portal")
    )
}