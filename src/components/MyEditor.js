import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from 'ckeditor5-custom-build';
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
    function handleChange(event, editor) {
        const data = editor.getData();
        console.log({ event, editor, data });
        onChange(data)
    }
    return (
        <div >
            <CKEditor
                config={{
                    // plugins: [ImageResize] ,
                    extraPlugins: [uploadPlugin],
                    fontSize: {
                        options: [8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48],
                        supportAllValues: true
                    }
                }}
                editor={Editor}
                data={props.content}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
}
MyEditor.propTypes = {
    onChange: PropTypes.func,
    content: PropTypes.string
};