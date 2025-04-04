import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, updateUserData } from '../../components/reducers/user/userThunk';
import "./editDetails.css";

const formStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '30vh',
    padding: '20px'
}

const EditDetails = () => {
    const dispatch = useDispatch();
    const { userData, loading, error } = useSelector((state) => state.user);
    const passwordLength = localStorage.getItem("passwordLength")
    const [editField, setEditField] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [editing, setEditing] = useState(false);

    console.log("This is the userData", userData);
  
    const handleEditClick = (field) => {
      setEditField(field);
      if (field === "email") setNewEmail(userData.email);
      if (field === "nickname") setNewNickname(userData.nickname);
      if (field === "password") setNewPassword(userData.password);
    };
  
    const handleEditUnactive = () => {
      setEditField(null);
      setEditing(false);
      if (newEmail === "") setNewEmail("");
      if (newNickname === "") setNewNickname(""); 
      if (newPassword === "") setNewPassword("");
    };
  
    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        dispatch(fetchUserData(accessToken));
      }
    }, [dispatch]);
  
    const handleEmailChange = (event) => {
      setNewEmail(event.target.value);
      setEditing(true);
    };
    const handleNicknameChange = (event) => {
      setNewNickname(event.target.value);
      setEditing(true);
    };
    const handlePasswordChange = (event) => {
      setNewPassword(event.target.value);
      setEditing(true);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const updatedData = {
        email: newEmail || userData.email,
        nickname: newNickname || userData.nickname,
        password: newPassword || userData.password,
      };
      dispatch(updateUserData(updatedData));
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div>
        <div className='edit-account-container'>
          <div className='edit-box'>
            {userData ? (
              <form style={formStyle} onSubmit={handleSubmit}>
                <div className='edit-input-container'>
                  <div>
                    이매일:&nbsp;&nbsp;
                    <input
                      placeholder={userData.email}
                      onChange={handleEmailChange}
                      className='edit-input'
                    />
                  </div>
                  <div>
                    닉내임:&nbsp;&nbsp;
                    <input
                      placeholder={userData.nickname}
                      onChange={handleNicknameChange}
                      className='edit-input'
                    />
                  </div>
                  <div>
                    비버호:&nbsp;&nbsp;
                    <input
                      placeholder={passwordLength > 0 ? "*".repeat(passwordLength) : "Enter new password"} 
                      onChange={handlePasswordChange}
                      className='edit-input'
                    />
                  </div>
                </div>
                <div className="profile-pic-circle">
                  <img src={userData.imgUrl} alt="Profile" />
                </div>
              </form>
            ) : (
              <p>사용자 정보를 로드 중...</p>
            )}
          </div>
        </div>
      </div>
    );
};
  

export default EditDetails;