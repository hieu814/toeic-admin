const { store } = require("src/stores/store");

const uploadFileApi = (formData) => {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/upload`, {
        method: 'POST',
        body: formData,

    })
};
export {
    uploadFileApi
}
