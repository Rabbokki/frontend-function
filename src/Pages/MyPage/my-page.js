import { useEffect, useState } from 'react';
import axios from 'axios';
import EditButton from "../../Components/buttons/EditButton";

const MyPage = () => {
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)

    const [editField, setEditField] = useState(null)
    const [newEmail, setNewEmail] = useState("")
    const [newNickname, setNewNickname] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const handleEditClick = (field) => setEditField(field)
    const handleEditUnactive = () => setEditField("")

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    setError('로그인 상태가 아닙니다.')
                    return
                }
                
                const response = await axios.get('/account/me', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                setUserData(response.data.data)

            } catch (error) {
                setError('사용자 정보를 가져오는 데 실패했습니다.')
                console.error(error)
            }
        }

        fetchUserData()
    }, [])
    if (error) return <div>{error}</div>

    const handleEmailChange = (event) => setNewEmail(event.target.value)
    const handleNicknameChange = (event) => setNewNickname(event.target.value)
    const handlePasswordChange = (event) => setNewPassword(event.target.value)

    const updateUserDetail = async (event) => {
        event.preventDefault()
    
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setError('로그인 상태가 아닙니다.')
            return
        }
    
        const updatedData = {
            email: newEmail || userData.email,
            nickname: newNickname || userData.nickname,
            password: newPassword || userData.password
        }
    
        try {
            const response = await axios.put('/account/me', updatedData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
    
            if (response.data.success) {
                setUserData((prevData) => ({
                    ...prevData,
                    email: updatedData.email,
                    nickname: updatedData.nickname
                }))
                setError(null)
                alert("Your details have been updated!")
            }
        } catch (error) {
            console.error(error)
            setError('사용자 정보를 업데이트하는 데 실패했습니다.')
        }
    }

    return (
        <div>
            {userData ? (
                <form onSubmit={updateUserDetail}>
                    <div>
                        <input placeholder={userData.email} readOnly={editField !== 'email'} onChange={handleEmailChange}/>
                        <EditButton clickEventEdit={() => handleEditClick('email')} clickEventDone={handleEditUnactive} fieldName='email' editField={editField}/>
                    </div>
                    <div>
                        <input placeholder={userData.nickname} readOnly={editField !== 'nickname'} onChange={handleNicknameChange}/>
                        <EditButton clickEventEdit={() => handleEditClick('nickname')} clickEventDone={handleEditUnactive} fieldName='nickname' editField={editField}/>
                    </div>
                    <div>
                        <input placeholder={userData.password} readOnly={editField !== 'password'} onChange={handlePasswordChange}/>
                        <EditButton clickEventEdit={() => handleEditClick('password')} clickEventDone={handleEditUnactive} fieldName='password' editField={editField}/>
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>사용자 정보를 로드 중...</p>
            )}
        </div>
    )
}

export default MyPage