import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom"

import './scss/style.scss';

import LoaderIcon from "./components/LoaderIcon.js";
import UploadIcon from "./components/UploadIcon.js";
import TimesIcon from "./components/TimesIcon.js";
import ColorPicker from "./components/ColorPicker.js";

import UmbrellaBlue from './assets/blue-umbrella.png';
import UmbrellaYellow from './assets/yellow-umbrella.png';
import UmbrellaPink from './assets/pink-umbrella.png';

const enLangJSON = require('./locale/en/lang.json');

const appRoot = document.querySelector('#app');
let imgBase64 = '';
const KByte = 1024;
const TwoSeconds = 2000;

const App = (props) => {
    const possibleColors = ['blue', 'yellow', 'pink'];
    const [ fileName, setFileName] = useState('');
    const [ logo, setLogo] = useState('');
    const [ activeColor, setActiveColor] = useState('blue');
    const [ fileError, setFileError] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);
    const [ currentUmbrella, setCurrentUmbrella] = useState(UmbrellaBlue);

    const imgWrapper = React.createRef();
    const umbrellaImg = React.createRef();

    const handleLogoUpload = (e) => {
        var fileName = '';
        var fileType = '';
        var fileSize = '';

        const file = e.target.files[0];
        e.target.value = '';
        imgBase64 = '';
        
        fileName = file.name;
        fileType = fileName.split('.')[1];

        fileSize = file.size / KByte / KByte;

        if(
            fileSize > 5 || 
            (fileType !== 'jpg' && fileType !== 'png' && fileType !== '.jpeg')
        ) {
            setFileError(true);
            return;
        }

        setFileError(false);
        setIsLoading(true);

        var reader = new FileReader();
        reader.onloadend = function() {
            imgBase64 = reader.result;

            setTimeout( () => {
                setIsLoading(false);
                setFileName(fileName);
            }, TwoSeconds);         
        }
        reader.readAsDataURL(file);
    }

    useEffect( () => {
        return () => {
            setLogo(imgBase64);
        }
    }, [isLoading])

    useEffect( () => {
        setCurrentUmbrella(prev => {
            let umbrella = null;

            switch(activeColor) {
                case 'blue':
                    umbrella = UmbrellaBlue;
                    break;
                case 'yellow':
                    umbrella = UmbrellaYellow;
                    break;
                case 'pink':
                    umbrella = UmbrellaPink;
                    break;
                default:
                    umbrella = UmbrellaBlue;
                    return;
            }
            return umbrella;
            
        });
        return () => {
            setIsLoading(true);

            setTimeout( () => {
                setIsLoading(false);
            }, TwoSeconds);
        }
    }, [activeColor])

    const removeCurrentFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);

        setTimeout( () => {
            setIsLoading(false);

            if(logo) {
                setFileName('');
                setLogo('');
                imgBase64 = '';
            }
        }, TwoSeconds);
    }

    return (
        <div className={`umbrella-app container-fluid ${activeColor}-bg-lighten`} >
            <div className="row align-items-center w-100">
                <div className="col-md-6 col-12 image-container">
                    <div className="image-wrapper" ref={imgWrapper}>

                        <img className={`${isLoading ? 'not-visible' : 'visible'}`} ref={umbrellaImg} src={currentUmbrella} alt="umbrella color" />
                        <LoaderIcon class={`${activeColor}-color loader-big ${!isLoading ? 'not-visible' : 'visible'}`} />
                        <img className={`logo ${isLoading ? 'not-visible' : ''} ${logo ? '' : 'not-visible'}`} src={logo} alt="Logo" />

                    </div>
                </div>
                <div className="col-md-6 col-12 content-container">
                    <h1 className="umbrella-title">{enLangJSON.header}</h1>
                    <ColorPicker colors={possibleColors} setActiveColor={setActiveColor} ></ColorPicker>

                    <h2 className="umbrella-customize">{enLangJSON.header2}</h2>
                    <p className="upload-logo-text">{enLangJSON.uploadPhoto}</p>
                    <p className="allowed-files">{enLangJSON.allowedFiles}</p>
                    <input type="file" id="file" name="file" className={`input-file`} onChange={handleLogoUpload} />
                    <label className={`${activeColor}-bg  ${fileError ? 'has-error' : ''}`} htmlFor="file">
                        <LoaderIcon class={`${activeColor}-color loader ${!isLoading ? 'not-visible' : 'visible'}`} />
                        <UploadIcon class={`${isLoading ? 'not-visible' : 'visible'}`} />
                        <span>
                            {` ${fileName ? fileName : enLangJSON.uploadLogo} `}
                        </span>
                        <TimesIcon class={`${fileName ? 'visible' : 'not-visible'}`} removeCurrentFile={removeCurrentFile} />
                    </label>
                    <p className={`file-type-error ${fileError ? 'error-show' : 'error-hide'}`} >{enLangJSON.invalidFile}</p>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, appRoot);