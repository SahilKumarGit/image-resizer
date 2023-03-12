import nodeZip from "node-zip";
import { Router } from "express";
import trimAll from "get-trim-all";
import { MimeTypes, MimeTypesObj } from "./resource.js"
import sharp from 'sharp';
import toIco from 'to-ico'
const router = Router();

router.post("/resizing", async (req, res) => {
    try {
        const file = req.files ? req.files[0] : null;
        const mimeTypeArr = MimeTypes.map(each => each.mimeType);
        if (!file) return res.status(400).send({ error: true, errorMessage: "Image file is required.", response: {} });
        if (!mimeTypeArr.includes(file.mimetype)) return res.status(400).send({ error: true, errorMessage: `Invalid image type (Only accept ${mimeTypeArr.join(', ')}).`, response: {} });

        let { sizing } = trimAll.default(req.body || {})
        if (!sizing) return res.status(400).send({ error: true, errorMessage: "Sizing is required.", response: {} });
        if (typeof sizing === 'string') {
            try {
                sizing = JSON.parse(sizing)
            } catch (_e) {
                return res.status(400).send({ error: true, errorMessage: "Sizing mustbe an array of json string.", response: {} });
            }
        }
        if (!Array.isArray(sizing) || sizing.length === 0) return res.status(400).send({ error: true, errorMessage: "Sizing mustbe an array with minimum one object.", response: {} });
        /*
        - the sizing contens:
        [{
            filename:"",
            height: 100,
            width: 100,
            type: ""
        }]
        */
        {
            // validate each object.
            let count = 0
            for (let object of sizing) {
                try {
                    if (!object['filename']) throw Error(`filename is required in position index ${count}.`)
                    if (!object['height']) throw Error(`height is required in position index ${count}.`)
                    if (!object['width']) throw Error(`width is required in position index ${count}.`)
                    if (!object['type']) throw Error(`type is required in position index ${count}.`)

                    if (typeof object['height'] !== 'number') throw Error(`height mustbe a number in position index ${count}.`)
                    if (typeof object['width'] !== 'number') throw Error(`width mustbe a number in position index ${count}.`)
                    if (!mimeTypeArr.includes(object['type'])) throw Error(`mimetype only accept ${mimeTypeArr.join(', ')} in position index ${count}.`)
                } catch (_) {
                    return res.status(400).send({ error: true, errorMessage: _.message || 'Unknown Error!', response: {} });
                }
                count++;
            }
            // scope end!
        }

        const Zip = new nodeZip();
        {
            // add files in to zip...
            Zip.file('README.md', 'hello there');
            const filename = {};
            for (let each of sizing) {
                let name = each.filename;
                // make files name unique
                if (Object.keys(filename).includes(each.filename)) {
                    name = `${each.filename}(${filename[each.filename]})`;
                    filename[each.filename] = filename[each.filename] + 1;
                } else {
                    filename[each.filename] = 1;
                }

                const type = MimeTypesObj[each.type].slice(1)
                if (each.type == "image/x-icon") {
                    const buffer = await sharp(file.buffer).resize(each.width, each.height).toFormat("png").toBuffer();
                    const icoBuffer = await toIco(buffer);
                    Zip.file(`${name}.${type}`, icoBuffer);
                    console.log(';;;;')
                } else {
                    const buffer = await sharp(file.buffer).resize(each.width, each.height).toFormat(type).toBuffer();
                    Zip.file(`${name}.${type}`, buffer);
                }
            }

        }
        var generateZip = Zip.generate({ base64: false, compression: 'DEFLATE' });
        const buffer = new Buffer.from(generateZip, 'binary');
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename= generate.zip`
        });
        return res.send(buffer);
    } catch (_e) {
        console.error(_e)
        return res.status(500).send({ error: true, errorMessage: _e.message, response: {}, });
    }
});

router.all("*", async (req, res) => {
    return res.status(404).send({
        error: true,
        errorMessage: "Invalid API Call, 404 Not Found!",
        response: {
            body: req.body,
            files: req.files || [],
            query: req.query,
            params: req.params,
        },
    });
});

export default router;
