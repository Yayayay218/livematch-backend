import CryptoJS from 'crypto-js'

const uploadFile = (params) => {

    console.log("Promise uploadFile: ", params);
    return new Promise((resolve, reject) => {
        if (params.data.file && params.data.file[0].rawFile instanceof File) {

            const formData = new FormData();
            formData.append('file', params.data.file[0].rawFile);
            fetch('/api/files', {
                method: 'post',
                body: formData,
            })
                .then(response => response.json())
                .then(file => {
                    var bytes  = CryptoJS.AES.decrypt(file, 'peWseTYsjSLDzZBFYhJb2ouZUxPMAHbR');
                    var tmp1 = bytes.toString(CryptoJS.enc.Utf8);
                    const tmp = {
                        ...params,
                        data: {
                            ...params.data,
                            coverPhoto: tmp1,
                        },
                    };
                    resolve(tmp)
                });
        } else {
            resolve(params);
        }
    });
};

const uploadAnswer = (params) => {
    console.log("Promise uploadFile: ", params);
    return new Promise((resolve, reject) => {
        if (params.data.answers[0].file && params.data.answers[0].file[0].rawFile instanceof File) {
            const photos = params.data.answers.filter(photo => photo.file[0].rawFile instanceof File);
            const formData = new FormData();
            photos.map(photo => formData.append('photos', photo));
            // console.log("addUploadCapabilities photos: ", photos);
            return fetch('/api/files', {
                method: 'post',
                body: formData,
            })
                .then(response => response.json())
                .then(photos => {
                    params = {
                        ...params,
                        data: {
                            ...params.data,
                            answers:{img: photos}
                        }
                    };
                    console.log(params);
                    resolve(params);
                });
        } else {
            resolve(params);
        }
    });
};

const addUploadCapabilities = requestHandler => (type, resource, params) => {
    if ((type === 'UPDATE' || type === "CREATE") &&
        (resource === 'fullMatches' || resource === 'highlights')) {
        console.log("addUploadCapabilities: ", params.data);
        if (Object.prototype.toString.call(params.data.file) === '[object Array]') {
            console.log("addUploadCapabilities length: ", params.data.file.length);
        } else {
            console.log("addUploadCapabilities length: 0");
        }

        return uploadFile(params)
            .then(params => requestHandler(type, resource, params))
            .catch(error => console.log(error.message));
    } else {
        return requestHandler(type, resource, params);
    }
};

export default addUploadCapabilities;