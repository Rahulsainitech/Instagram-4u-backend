export const initialState = null  
export const reducer = (state,action)=>{
    if(action.type==='USER'){
        return action.payload
    }
    else if(action.type==='CLEAR'){
        return null
    }
    else if(action.type==='UPDATE'){
        return ({
            ...state,
            follower:action.payload.follower,
            following:action.payload.following
        })
    }
    else if(action.type ==='UPDATEPIC'){
        return({
            ...state,
            photo:action.payload.photo
        })
    }
    return state
}