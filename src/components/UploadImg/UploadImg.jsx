import React, { useState, useRef } from "react";
import "./style.scss";
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setImageList } from "../../store/imageStore/action";
import { setDescList } from "../../store/descStore/action";
import JSZip from 'jszip';
import pako from 'pako';

import axios from 'axios';


const UploadImg = () => {
    // for test
    const testImgInfo = {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'forInterfaceURL',
    }
    const uploadRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageDataList, setImageDataList] = useState([]);
    const { Dragger } = Upload;
    const navigate = useNavigate();
    const imageList = useSelector(state => {
        console.log(state.ImageList);

    })
    const descList = useSelector(state => {
        console.log(state.DescList);
    })
    const dispatch = useDispatch();



    // Server API #TODO
    const SERVER_URL = 'http://localhost:8080'
    const UPLOAD_URL = `${SERVER_URL}/upload`
    const DESC_URL = `${SERVER_URL}/desc`

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    }

    const handleCustomRequest = function (options) {
        const { file, onSuccess, onError } = options;
        if (!beforeUpload) return;
        setLoading(true);
        console.log(file)
        // 创建 FormData 对象，用于发送图片数据
        const formData = new FormData();
        formData.append('image', file);
        console.log(formData.get('image'))
        // fileList?.forEach((file) => {

        //     formData.append('files[]', file);
        // });
        try {
            // send the image to server to process
            axios.post(UPLOAD_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            })
                .then(response => {
                    console.log(response);
                    processImgsFromServer(response);
                    // const objectUrl = URL.createObjectURL(response.data);
                    // imageDataList.push(objectUrl);
                    // setImageDataList(imageDataList);
                    // console.log(imageDataList);
                    onSuccess(response, file);

                    // return response.blob();
                })
                // .then(blob => {
                //     const objectUrl = URL.createObjectURL(blob);
                //     console.log(objectUrl);
                //     // 
                // })
                .catch(error => {
                    onError(error);
                });
            // const imageUrls = response.data;
            // console.log(response);
            // // TODO process imgs response by server
            // setImageUrl(imageUrls);
        } catch (error) {
            message.error('上传图片失败，请重试!');
        } finally {
            setLoading(false);
        }
    }
    const beforeUpload = function (file) {
        console.log(file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB!');
            return false;
        }
        return true;
    }
    const handleChange = (info) => {

        const { file, fileList } = info;
        // console.log("onChange", fileList)
        // const { status, response } = file;
        // console.log(response);
        // if (status === 'done') {
        //     // 文件上传成功，可以从 response 中获取服务器端响应的数据
        //     console.log('服务器端响应数据：', response);
        //     setLoading(false);
        //     // 进行处理响应数据的逻辑
        //     const imageUrls = response.data;

        //     // TODO process imgs response by server
        //     setImageUrl(imageUrls);
        // } else if (status === 'error') {
        //     // 文件上传失败，可以从 info.fileList 中获取错误信息
        //     console.log('上传失败：', fileList);
        //     // 进行错误处理的逻辑
        // }
        setFileList(fileList)

    };
    const handleRemove = function (file) {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }

    const handleUploadClick = function () {

        // 调用 Upload 组件的 upload 方法，触发上传操作

        // const uploadInstance = uploadRef.current;
        // if (uploadInstance) {
        //     uploadInstance.upload();
        //     setLoading(true)
        // }
        // get description info about result image
        axios.get(DESC_URL)
            .then(response => {
                // setDescArray(response.data);
                // TODO process data get from server
                const desc = response.data;
                dispatch(setDescList(desc))
            })
            .catch(error => {
                dispatch(setDescList("it is a test"))
                console.error(error);
            });
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/result');
        }, 2000)



    }
    const handleTest = function () {
        const data = 'hello world';
        // axios.post('http://localhost:8080/upload', data)
        //     .then(response => {
        //         // 处理响应结果
        //         console.log(response)
        //     })
        //     .catch(error => {
        //         // 处理错误
        //     });

        dispatch(setImageList([1, 2, 3]))

    }
    // const processImgsFromServer = async function (response) {

    //     const binaryData = response.data;
    //     console.log(binaryData)
    //     // 假设 binaryData 是 application/octet-stream 类型的数据
    //     const zip = new JSZip();
    //     try {
    //         await zip.loadAsync(binaryData)
    //             .then((zip) => {
    //                 // 遍历压缩包中的文件
    //                 console.log(zip)
    //                 zip.forEach((relativePath, file) => {
    //                     console.log(`File ${relativePath}:`);
    //                     // 读取文件内容
    //                     console.log(file);
    //                     let uint8Array = file._data.compressedContent;
    //                     console.log(file._data.compressedContent);
    //                     const imageData = new Uint8Array(uint8Array);
    //                     // const imageData = uint8Array;
    //                     // console.log(uint8Array);
    //                     // const imageData = pako.ungzip(uint8Array);
    //                     // 将二进制数据转换为 Blob 对象
    //                     const blob = new Blob([imageData], { type: 'image/png' });
    //                     console.log(blob)
    //                     // 将 Blob 对象转换为图片 URL
    //                     const imageUrl = URL.createObjectURL(blob);
    //                     console.log(imageUrl);
    //                     const img = document.createElement('img');
    //                     img.src = imageUrl;
    //                     document.body.appendChild(img);
    //                     // const objectUrl = URL.createObjectURL(file);
    //                     imageDataList.push(imageUrl);
    //                     // // setImageDataList(imageDataList);
    //                     // console.log(imageDataList);
    //                     // file.async('string').then((content) => {
    //                     //     console.log(content);
    //                     // });
    //                 });
    //                 console.log(imageDataList)
    //                 setImageDataList(imageDataList);
    //             });

    //     } catch (error) {
    //         console.error('An error occurred:', error);

    //     }

    //     console.log("test");
    //     console.log(zip);
    //     setImageDataList(imageDataList);
    //     // const dataList = response.data.map(data => {
    //     //     const base64 = btoa(
    //     //         new Uint8Array(data)
    //     //             .reduce((data, byte) => data + String.fromCharCode(byte), '')
    //     //     );
    //     //     return `data:image/png;base64,${base64}`;
    //     // });

    // }
    const processImgsFromServer = function (response) {
        const zipData = response.data;
        // 将 ZIP 文件的字节数组转换为 Blob 对象
        const blob = new Blob([zipData], { type: 'application/zip' });
        const urls = [];

        // 使用 JSZip 解压 ZIP 文件
        JSZip.loadAsync(blob).then(zip => {
            // 遍历 ZIP 文件中的所有文件
            Object.keys(zip.files).forEach(filename => {
                // 读取文件的二进制数据
                zip.files[filename].async('uint8array').then(data => {
                    // 将二进制数据转换为图片
                    const blob = new Blob([data], { type: 'image/jpeg' });
                    const url = URL.createObjectURL(blob);
                    urls.push(url);
                    dispatch(setImageList([...urls]));
                    // const image = new Image();
                    // image.src = url;

                    // // 将图片添加到页面中
                    // document.body.appendChild(image);
                    // setImageDataList(imageList);

                });
                // console.log(urls)
                // dispatch(setImageList([...urls]));
            });
        });
    }

    return (
        <>

            <ImgCrop
                rotationSlider
                modalTitle="Crop Your Image"
            >
                <Upload
                    name='uploadFile'
                    // action={UPLOAD_URL}
                    // multiple={true}
                    // ref={uploadRef}
                    listType="picture-card"
                    fileList={fileList}
                    onRemove={handleRemove}
                    // beforeUpload={(file) => {
                    //     // console.log(file);
                    //     // handleUpload(file);
                    //     return false; // stop default upload event
                    // }}
                    onChange={handleChange}
                    onPreview={onPreview}
                    customRequest={handleCustomRequest}
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
            </ImgCrop>
            <Button
                type="primary"
                onClick={handleUploadClick}
                disabled={fileList.length === 0}
                loading={loading}
                style={{ marginTop: 16, marginRight: 200 }}
            >

                {loading ? 'Processing...' : 'Process Image'}
            </Button>
            {/* {loading && <div>正在上传图片，请稍候...</div>} */}

            {/* <Buttons
                onClick={handleTest}>
                test
            </Buttons> */}
        </>
    )
}


export default UploadImg;