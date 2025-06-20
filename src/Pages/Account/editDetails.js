import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUserData } from '../../components/reducers/user/userThunk';
import "./editDetails.css";

const EditDetails = () => {
  const { userData, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    nickname: '',
    email: '',
    birthday: '',
    imgUrl: '',
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setProfileData({
        nickname: userData?.nickname,
        email: userData?.email,
        birthday: userData?.birthday,
        imgUrl: userData?.imgUrl,
      });
    }
    fetchUserInfo();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, imgUrl: previewUrl }));
    }
  };

  const handleImageDelete = () => {
    setSelectedImageFile(null);
    setProfileData((prev) => ({ ...prev, imgUrl: '' }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveProfile = async () => {
    console.log("Fart master");
    const formData = new FormData();
    const updateData = {
      nickname: profileData.nickname,
      email: profileData.email,
      birthday: profileData.birthday,
      imgUrl: profileData.imgUrl,
    };

    const jsonBlob = new Blob([JSON.stringify(updateData)], {
      type: 'application/json',
    });

    formData.append('request', jsonBlob);

    if (selectedImageFile) {
      formData.append('profileImage', selectedImageFile);
    } else if (!profileData.imgUrl) {
      updateData.imgUrl = '';
    }

    dispatch(updateUserData(formData)).unwrap()
      .then(() => navigate('/account'))
      .catch((error) => console.error("오류"));
  };
  
  return (
    <div className="edit-details-container">
      <h2>프로필 수정</h2>

      <div className="profile-image-section">
        {profileData.imgUrl ? (
          <img src={profileData.imgUrl} alt="Profile Preview" className="profile-preview" />
        ) : (
          <div className="profile-placeholder">No Image</div>
        )}
        <div className="image-buttons">
          <button className="change-image-button" onClick={triggerFileInput}>이미지 변경</button>
            {profileData.imgUrl && (
          <button className="delete-image-button" onClick={handleImageDelete}>삭제</button>
            )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          value={profileData.nickname}
          onChange={handleProfileChange}
        />
      </div>

      <div className="form-group">
        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleProfileChange}
        />
      </div>

      <div className="form-group">
        <label>생년월일</label>
        <input
          type="date"
          name="birthday"
          value={profileData.birthday}
          onChange={handleProfileChange}
        />
      </div>

      <div className="save-button">
        <button className="save-changes-button" onClick={handleSaveProfile}>
          저장하기
        </button>
      </div>
    </div>
  );
};
  

export default EditDetails;