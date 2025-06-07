// function canViewProfile(currentUser, targetUser) {
//   if (targetUser.privacy.profile === 'public') return true;
//   if (targetUser.privacy.profile === 'followers') {
//     return targetUser.followers.includes(currentUser._id);
//   }
//   return currentUser._id.equals(targetUser._id); // Self only
// }
// module.exports = canViewProfile;

// utils/privacyCheck.js

function canViewProfile(currentUser, targetUser) {
  if (targetUser.privacy?.profile === 'public') return true;

  if (targetUser.privacy?.profile === 'followers') {
    return targetUser.followers.some(follower =>
      follower.equals ? follower.equals(currentUser._id) : follower.toString() === currentUser._id.toString()
    );
  }

  return currentUser._id.toString() === targetUser._id.toString(); // Only self
}

module.exports = canViewProfile;
