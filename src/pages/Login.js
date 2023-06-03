import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../assets/alo.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

import { getUserRoute, loginRoute, registerRoute } from '../utils/APIRoutes';
import { AppContext } from '../context/AppContext';


// const gGProvider = new GoogleAuthProvider(auth)
export default function Login() {
    const { setEmail } = useContext(AppContext)  
    const navigate = useNavigate()
    const [values, setValues] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            console.log("in validation", loginRoute)
            const { password, email } = values
            const { data } = await axios.post(loginRoute, {
                email,
                password,
            })

            if (!data.status) {
                toast.error(data.msg)
            }else 
            {
                // setCurrentUser(data.user)
                if (data.user.isVerified) {
                    setEmail(email)
                    console.log(data)
                    localStorage.setItem("currentUser", JSON.stringify(data.user))
                    navigate('/home')
                }
                else {
                    setEmail(email)
                    console.log(data)
                    localStorage.setItem("currentUser", JSON.stringify(data.user))
                    navigate('/wait-verify/')
                }
            }
        }
    }

    const handleValidation = () => {
        const { password, email } = values
        if (password === "") {
            console.log("Password and confirm password should be same")
            toast.error("Email và password là bắt buộc!", {
                pauseOnHover: true,
            })
            return false;
        } else if (email.length === "") {
            toast.error("Email và password là bắt buộc!", {
                pauseOnHover: true,
            })
            return false
        } else return true
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }
    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className='brand'>
                        <img src={Logo} alt='' />
                    </div>
                    <input
                        type='text'
                        placeholder='Email đăng nhập:'
                        name='email'
                        onChange={e => handleChange(e)}
                        min="3"
                    />

                    <input
                        type='password'
                        placeholder='Mật khẩu:'
                        name='password'
                        onChange={e => handleChange(e)}
                    />

                    <button type='submit'>Đăng nhập</button>
                    <span>Chưa có tài khoản ? <Link to="/register">Đăng ký</Link></span>
                    {/* <div>
                        <GoogleButton onClick={() => handleGgLogin()} />
                    </div> */}
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`

height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
gap: 1rem;
align-items: center;
justify-content: center;
background-color: #fff;
.brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
        height: 3rem;
    }

    h1 {
        text-transform: uppercase;
    }
}

form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 10px;
    padding: 2rem 5rem;
    box-shadow: 1px 1px 6px rgb(0 0 0 / 40%);

    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #0180c7;
        border-radius: 0.4rem;  
        width: 100%;
        font-size: 0.8rem;
        &:focus {
            border: 0.1rem solid #0180c7;
            outline: none; 
        }
    }

    button {
        background: #0180c7;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;  
        cursor: pointer;
        border-radius: .4rem;
        font-size: 1rem;
        text-transform : uppercase;
        &:hover {
            background: rgba(1, 128, 199, .8);
        }
    }

    span {
        text-transform: uppercase;
        font-weight: bold;
        font-size: .8rem;

        a {
            text-decoration: none;
        }
    }
}`;
