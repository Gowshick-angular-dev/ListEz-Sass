import React, { useEffect, useState} from 'react';
import moment from 'moment'
import { useAuth } from './modules/auth';

const IdleTimeOutHandler = (props)=>{
    const[showModal,setShowModal]=useState(false)
    const[isLogout,setLogout]=useState(false)
    const {currentUser, saveAuth, setCurrentUser, logout} = useAuth();
    let timer = undefined;
    let timer2 = parseInt(props.timer);
    const events= ['click','load','keydown']

    const eventHandler =(eventType)=>{        
        if(!isLogout){
            localStorage.setItem('lastInteractionTime', new Date() )
            if(timer){
                props.onActive();
                startTimer();
            }
        }        
    };
    
    useEffect(()=>{
        addEvents();        
        return (()=>{
            removeEvents();
            clearTimeout(timer);
        })
    },[timer2])
    
    const startTimer=()=>{        
        if(timer){
            clearTimeout(timer)
        }
        const timeOutInterval = timer2 * 60000;
        timer=setTimeout(()=>{            
            let lastInteractionTime=localStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            if(isLogout) {
                clearTimeout(timer)
            }else{
                if(diff._milliseconds < timeOutInterval) {
                    startTimer();
                    props.onActive();
                } else {
                    props.onIdle();
                    setShowModal(true)
                    saveAuth(undefined) 
                    setCurrentUser(undefined)
                    logout()
                }
            }            
        }, timeOutInterval ? timeOutInterval : 60000)         
    }

    const addEvents=()=>{        
        events.forEach(eventName=>{
            window.addEventListener(eventName,eventHandler)
        })        
        startTimer();
    }
    
    const removeEvents=()=>{
        events.forEach(eventName=>{
            window.removeEventListener(eventName,eventHandler)
        })
    };
    
    return(<></>)        
    }
    
    export default IdleTimeOutHandler;