import React from 'react'
import Layout from '../components/Layout'
import { message, notification, Tabs } from 'antd';
import { useSelector ,useDispatch} from 'react-redux';
import {showLoading,hideLoading} from "../redux/features/alertSlice";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {updateUserNotifications} from "../redux/features/userSlice"



const NotificationPage = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const {user} =useSelector(state => state.user)


  //handle read notification
  const handleMarkAllRead =async () =>{
    try{
      dispatch(showLoading())
      const res = await axios.post('/api/v1/user/get-all-notification',
      {userId:user._id,}, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      dispatch(hideLoading())
      if(res.data.success){
        message.success(res.data.message)
        dispatch(updateUserNotifications(res.data.data));// added
      }else{
        message.error(res.data.message)
      }

    }catch(error){
      dispatch(hideLoading())
      console.log(error)
      message.error("Something Went Wrong")
    }
  }

  //delete all read
  const handleDeleteAllRead =async() =>{
    try{
      dispatch(showLoading())
      const res=await axios.post('/api/v1/user/delete-all-notification',{userId:user._id},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      dispatch(hideLoading())
      if(res.data.success){
        message.success(res.data.message)
      }else{
        message.error(res.data.message)
      }

    }catch(error){
      console.log(error)
      message.error("Some Went Wrong In Notification")
      dispatch(hideLoading())
    }
    
  }

  return (
    <Layout>
    
        <h4 className='p-3 text-center'>Notification Page</h4>
        <Tabs>
          <Tabs.TabPane tab="Unread" key={0}>
            <div className='d-flex justify-content-end'>
              <h4 className='p-3 text-primary' onClick={handleMarkAllRead} style={{cursor:'pointer'}}>Mark All Read</h4>
            </div>
            {
               user&&user.notification && user.notification.map(notificationMgs =>(
                <div className='card'  style={{cursor:'pointer'}}>
                  <div className='card-text' onClick={()=>navigate ('/doctor-appointments')}>
                    {notificationMgs.message}
                  </div>
                </div>

              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="Read" key={1}>
            <div className='d-flex justify-content-end'>
              <h4 className='p-3 text-primary' onClick={handleDeleteAllRead} style={{cursor:'pointer'}}>Delete All Read</h4>
            </div>
            {
               user&&user.seennotification&&user.seennotification.map(notificationMgs =>(
                <div className='card'  style={{cursor:'pointer'}}>
                  <div className='card-text' onClick={()=>navigate ('/doctor-appointments')}>
                    {notificationMgs.message}
                  </div>
                </div>

              ))
            }

          </Tabs.TabPane>
        </Tabs>
    
    </Layout>
  )
}

export default NotificationPage
