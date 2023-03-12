import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PropTypes from "prop-types";

export default function MyEditor({ onChange, ...props }) {
    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    loader.file.then((file) => {
                        const formData = new FormData();
                        formData.append("image", file);

                        fetch(
                            "https://api.imgbb.com/1/upload?key=08300781a20fb13889201fb9079abfab",
                            {
                                method: "POST",
                                body: formData,
                            }
                        )
                            .then((response) => response.json())
                            .then((result) => {
                                console.log(result);
                                // resolve(result.data.url);
                                resolve({
                                    default: result.data.url
                                });
                            })
                            .catch((error) => {
                                reject("Upload failed");
                                console.error("Error:", error);
                            });

                    });
                });
            }
        };
    }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }
    return (
        <div >
            <CKEditor
                config={{
                    // plugins: [ImageResize] ,
                    extraPlugins: [uploadPlugin],
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
                }}
                editor={ClassicEditor}
                data={props.content}
                onChange={onChange}
                {...props}
            />
        </div>
    );
}
MyEditor.propTypes = {
    onChange: PropTypes.func,
    content: PropTypes.string
};