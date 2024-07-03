import React, { useState } from 'react';
import './styles/signup.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must contain at least 8 characters, one uppercase letter, one number, and one special character.');
            return false;
        }
        return true;
    };

    const validatePhoneNumber = () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setPhoneError('Phone number must be 10 digits long and start with 6, 7, 8, or 9.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newError = '';
        setPhoneError('');
        setPasswordError('');
        
        if (!validatePhoneNumber()) {
            return;
        }
        if (!password) {
            newError = 'Password is required.';
        } else if (!retypePassword) {
            newError = 'Retype Password is required.';
        } else if (password !== retypePassword) {
            newError = 'Passwords do not match.';
        } else if (!validatePassword()) {
            return;
        }
        if (newError) {
            setPasswordError(newError);
            return;
        }

        try {
            const res = await api.post(`/auth/signup`, { name, email, phoneNumber: phone, password });
            if (res.data.msg === 'Email already exist') {
                setPasswordError(res.data.msg);
                toast.error(res.data.msg, { autoClose: 3000 });
            }
            if (res.data.msg === 'User Created Successfully') {
                toast.success('Successfully stored details', { autoClose: 3000 });
                localStorage.setItem('userId', res.data.userId);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                setName('');
                setEmail('');
                setPhone('');
                setPassword('');
                setRetypePassword('');
            }
        } catch (err) {
            toast.error('Signup failed', { autoClose: 3000 });
        }
    };

    const handleLogin = () => {
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }

    return (
        <div className='signup-body'>
            <div className='signup-container'>
                <div className='signup-content'>
                    <div className='signup-form'>
                        <div className='signup-head'>
                            <h1>Sign Up</h1>
                        </div>
                        <div className="signup-input">
                            <input type='text' name="Name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="signup-input">
                            <input type='email' name="Email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="signup-input">
                            <input type='text' name="phone" placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="signup-input">
                            <input type='password' name="Password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {password && (
                            <div className="signup-input">
                                <input type="password" value={retypePassword} placeholder="Retype-Password" onKeyDown={handleEnter} onChange={(e) => setRetypePassword(e.target.value)} />
                            </div>
                        )}
                        <div className='signup-text'>
                            <p>Already a member? <span className='signup-text-span' onClick={handleLogin}>Login</span></p>
                        </div>
                        <div className="signup-button">
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                        {passwordError && <div className='signup-error blink'><p className="error-message">{passwordError}</p></div>}
                        {phoneError && <div className='signup-error blink'><p className="error-message">{phoneError}</p></div>}
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;
