// Login.js

const Tables = () => {
  
  
  
  
  return (
    <>
      <header>
        <h2>{`${user.role} - ${user.email}`}</h2>
        <button onClick={handleLogout}>
              <img src={logOut} />
          </button>
      </header>
    </>
  );
};

export default Tables;