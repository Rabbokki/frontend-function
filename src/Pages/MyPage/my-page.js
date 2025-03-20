import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, updateUserData } from '../../Components/reducers/user/userThunk';
import EditButton from "../../Components/buttons/EditButton";
import SaveChangesButton from '../../Components/buttons/SaveChangesButton';
import "./my-page.css";

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30vh',
    padding: '20px'
}

const MyPage = () => {
    const dispatch = useDispatch();
    const { userData, loading, error } = useSelector((state) => state.user);
    const passwordLength = useSelector((state) => state.user.passwordLength);
    const [editField, setEditField] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [editing, setEditing] = useState(false);
  
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
        {userData ? (
          <form style={formStyle} onSubmit={handleSubmit}>
            <div>
              <input
                placeholder={userData.email}
                readOnly={editField !== 'email'}
                onChange={handleEmailChange}
                className={`p-2 ${editField !== 'email' ? 'bg-gray-200' : 'bg-white'} placeholder-gray-400`}
              />
              <EditButton clickEventEdit={() => handleEditClick('email')} clickEventDone={handleEditUnactive} fieldName="email" editField={editField} />
            </div>
            <div>
              <input
                placeholder={userData.nickname}
                readOnly={editField !== 'nickname'}
                onChange={handleNicknameChange}
                className={`p-2 ${editField !== 'nickname' ? 'bg-gray-200' : 'bg-white'} placeholder-gray-400`}
              />
              <EditButton clickEventEdit={() => handleEditClick('nickname')} clickEventDone={handleEditUnactive} fieldName="nickname" editField={editField} />
            </div>
            <div>
              <input
                placeholder={passwordLength > 0 ? "*".repeat(passwordLength) : "Enter new password"} 
                readOnly={editField !== 'password'}
                onChange={handlePasswordChange}
                className={`p-2 ${editField !== 'password' ? 'bg-gray-200' : 'bg-white'} placeholder-gray-400`}
              />
              <EditButton clickEventEdit={() => handleEditClick('password')} clickEventDone={handleEditUnactive} fieldName="password" editField={editField} />
            </div>
            {editing && <SaveChangesButton editing={editing} />}
          </form>
        ) : (
          <p>사용자 정보를 로드 중...</p>
        )}
      </div>
    );
};
  

export default MyPage;
