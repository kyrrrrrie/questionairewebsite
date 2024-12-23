const initstate = ''
export default function changeSearchResult(preState = initstate, action:any) {
    const { type, data } = action
    switch (type) {
        case 'change':
            preState=data
            return preState

        default:
            return preState;
    }
}