

const Header = () => {
    return (
        <header>
            <h2>{`${user.role} - ${user.email}`}</h2>
            <button onClick={handleLogout}>
                <img src={logOut} />
          </button>
        </header>
    )
}

export default Header;