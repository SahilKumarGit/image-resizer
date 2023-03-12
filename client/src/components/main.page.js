import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios';
import fileDownload from 'js-file-download';

const def = [
    {
        filename: "icon-72x72",
        height: 72,
        width: 72,
        type: "image/png"
    }, {
        filename: "icon-96x96",
        height: 96,
        width: 96,
        type: "image/png"
    }, {
        filename: "icon-128x128",
        height: 128,
        width: 128,
        type: "image/png"
    }, {
        filename: "icon-144x144",
        height: 144,
        width: 144,
        type: "image/png"
    }, {
        filename: "icon-152x152",
        height: 152,
        width: 152,
        type: "image/png"
    }, {
        filename: "icon-192x192",
        height: 192,
        width: 192,
        type: "image/png"
    }, {
        filename: "icon-384x384",
        height: 384,
        width: 384,
        type: "image/png"
    }, {
        filename: "icon-512x512",
        height: 512,
        width: 512,
        type: "image/png"
    }, {
        filename: "apple-touch-icon",
        height: 192,
        width: 192,
        type: "image/png"
    }
]

export function TopNavBar({ file, setFile }) {
    return (
        <div className="TopNavBar">
            <div className="left" onClick={() => { setFile(undefined) }}>
                {file ? <div className="IconBox"><i className="fa fa-angle-left"></i></div> : ''}
                Image Resizer!
            </div>
            <div className="right" onClick={() => { window.open('https://github.com/SahilKumarGit/image-resizer.git') }}>
                <i className="fa fa-github"></i>
            </div>
        </div>
    );
}



export function SelectImage({ setFile }) {

    return (
        <div className="SelectImage">
            <h3 className='mb-4'>Select an image file to continue.</h3>
            <FileUploader

                multiple={false}
                handleChange={setFile}
                name="file"
                types={["JPEG", "PNG"]}
            />
            <div className='mt-4 txt-sm'>Note: JPEG and PNG only accept as aan image file.</div>
            <div className='txt-sm'>This project is available in <a href="https://github.com/SahilKumarGit/image-resizer.git">Github</a>.</div>
        </div>
    );
}



export function AfterSelectImage({ setFile, file, preview, array, setArray, setLoading, Loading }) {
    const [valid, setValid] = useState(false)
    useEffect(() => {
        setArray(def)
    }, [])

    useEffect(() => {
        if (!array || !Array.isArray(array) || array.length === 0) return setValid(false)
        for (let each of array) {
            if (!each.filename || !each.filename.trim()) return setValid(false)
            if (!each.type || !each.type.trim()) return setValid(false)
            if (!each.height || each.height === 0) return setValid(false)
            if (!each.width || each.width === 0) return setValid(false)
        }
        return setValid(true)
    }, [array])

    const addOneMore = () => {
        setArray([...array, {
            filename: "",
            height: 0,
            width: 0,
            type: "image/png"
        }])
    }

    const DownloadZipFile = async () => {
        if (!valid) return;
        if (Loading) return;
        setLoading(true)
        console.log(array)
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("sizing", JSON.stringify(array || []));

            const resp = await axios.post('./api/resizing', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Important
            });

            console.log(resp.data)

            fileDownload(resp.data, 'downloadCompressedImages.zip');
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert(error.error?.message || error.message || 'Internal Error 500!')
        }
    }

    return (
        <div className="AfterSelectImage">
            <div className="left">

                <img src={preview} alt="" />

            </div>
            <div className="right">
                {array.map((each, i) => <EachElement key={i} array={array} setArray={setArray} i={i} />)}

                <div onClick={addOneMore} className="btn btn-secondary w-100">Add New</div>
                {valid ? <div onClick={DownloadZipFile} className="btn btn-success mt-2 w-100">Download .Zip</div> :
                    <div className="btn btn-light mt-2 w-100">Download .Zip</div>}
            </div>
        </div>
    );
}



export function EachElement({ array, setArray, i }) {

    const setOnChange = (event, key) => {
        const temp = [...array];
        temp[i][key] = event.target.type === 'number' ? Number(event.target.value) : event.target.value
        setArray([...temp])
    }

    const setOnRemove = () => {
        const temp = [...array];
        temp.splice(i, 1)
        setArray(temp)
        console.log(array)
    }

    return (
        <div className="EachElement mb-2 card card-body">
            <div className="left">
                <div className="input-group mb-3">
                    <input title="File name here" value={array[i].filename} onChange={(event) => { setOnChange(event, 'filename') }} type="text" className="form-control w-50" placeholder="File Name" />
                    <select title="Select a file type" value={array[i].type} onChange={(event) => { setOnChange(event, 'type') }} className="form-control w-50" placeholder="File Type">
                        <option value="image/png">png</option>
                        <option value="image/jpeg">jpg</option>
                        <option value="image/jpeg">jpeg</option>
                        <option value="image/gif">gif</option>
                        <option value="image/bmp">bmp</option>
                        <option value="image/webp">webp</option>
                        <option value="image/svg+xml">svg</option>
                        <option value="image/tiff">tiff</option>
                        <option value="image/x-icon">ico</option>
                        <option value="image/heif">heic</option>
                        <option value="image/heif">heif</option>
                        <option value="image/avif">avif</option>
                    </select>
                </div>
                <div className="input-group w-100">
                    <input title="Image height here" value={array[i].height} onChange={(event) => { setOnChange(event, 'height') }} type="number" placeholder="height" className="form-control" />
                    <div className="input-group-prepend">
                        <span className="input-group-text">X</span>
                    </div>
                    <input title="Image width here" value={array[i].width} onChange={(event) => { setOnChange(event, 'width') }} type="number" placeholder="width" className="form-control" />
                </div>
            </div>
            <div onClick={setOnRemove} className="closeBox">
                <i className="fa fa-times-circle"></i>
            </div>
        </div>
    );
}