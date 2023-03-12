import './App.css';
import { AfterSelectImage, SelectImage, TopNavBar } from './components/main.page';
import { useState } from 'react';

function App() {
  const [file, setFile] = useState()
  const [preview, setPreview] = useState()
  const [array, setArray] = useState([])
  const [Loading, setLoading] = useState(false)

  const onFileChange = (resp) => {
    setFile(resp);

    if (!resp) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(resp)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }
  return (
    <div className="App">
      <TopNavBar file={file} setFile={setFile} />
      {!file ? <SelectImage setFile={onFileChange} /> : <AfterSelectImage array={array} setArray={setArray} file={file} setFile={setFile} preview={preview} setLoading={setLoading} Loading={Loading} />}
      {Loading ? <div className="Loading">
        <lottie-player src="loading.json" background="transparent" speed="1" style={{ width: 80, height: 80 }} loop autoplay></lottie-player>
      </div> : ''}
    </div>
  );
}

export default App;
