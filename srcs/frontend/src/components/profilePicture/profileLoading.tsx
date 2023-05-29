import { Spin } from 'antd'
import React from 'react'
import { ProfileLoadingContainer } from './profilePicture.styled'

const ProfileLoading = () => {
  return (
    <ProfileLoadingContainer>
        <Spin />
    </ProfileLoadingContainer>
  )
}

export default ProfileLoading