export const SET_IMAGE_LIST = "SET_IMAGE_LIST";

export const setImageList = (imageList)=>{
    return {
        type: SET_IMAGE_LIST,
        payload:imageList
    }
}