import { SET_IMAGE_LIST } from './action'

const initialImageList = {
    imageList: []
}
export default {
    ImageList(state = initialImageList, action) {
        const { type, payload } = action;
        switch (type) {
            case SET_IMAGE_LIST:
                state.imageList = payload;
                console.log(payload)
                console.log(state.imageList);
                localStorage.setItem('imageList', JSON.stringify(state.imageList))
                return { ...state }
            default:
                return state;
        }
    }
}