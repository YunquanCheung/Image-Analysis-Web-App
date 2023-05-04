import { SET_DESC_LIST } from './action'

const initialDescList = {
    descList: []
}
export default {
    DescList(state = initialDescList, action) {
        const { type, payload } = action;
        switch (type) {
            case SET_DESC_LIST:
                state.descList = payload;
                console.log(payload)
                console.log(state.descList);
                localStorage.setItem('descList', JSON.stringify(state.descList))
                return { ...state }
            default:
                return state;
        }
    }
}