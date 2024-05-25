import React, { useEffect, useState } from 'react'
import {Row, Col, Card, Button, InputGroup, Form} from 'react-bootstrap'
import {app} from '../firebaseInit';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import ModalAddress from './ModalAddress';
import ModalPhoto from './ModalPhoto';

const Mypage = () => {
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const uid=sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        email:sessionStorage.getItem('email'),
        name:'우기명',
        phone:'010-1111-2222',
        address1:'인천 어딘가',
        address2:'인하대'
    });

    const {name, phone, address1, address2} = form; //비구조 할다
    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(name===""){
            alert("이름 입력해주세요");
            return;
        }
        if(!window.confirm("변경된 내용 저장할까요?")) return;
        //정보 저장
        console.log(form);
        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    }

    const callAPI = async() => {
        setLoading(true);
        const res = await getDoc(doc(db, `users/${uid}`));
        if(res.data()){
            setForm(res.data());
        }
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[])

    if(loading) return <h1 className='text-center'>로딩중...</h1>
  return (
    <Row className='justify-content-center my-5'> 
        <Col xs={12} md={10} lg={8}>
            <Card>
                <Card.Header>
                    <h3 className='text-center'>마이페이지</h3>
                </Card.Header>
                <Card.Body>
                    <div>
                        <ModalPhoto setLoading={setLoading} form={form} setForm={setForm}/>
                    </div>
                    <form onSubmit={onSubmit}>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>이름</InputGroup.Text>
                            <Form.Control name='name' value={name} onChange={onChangeForm}/>
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text>전화</InputGroup.Text>
                            <Form.Control name='phone' value={phone} onChange={onChangeForm}/>
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text>주소</InputGroup.Text>
                            <Form.Control name='address1' value={address1} onChange={onChangeForm}/>
                            <ModalAddress form={form} setForm={setForm}/>
                        </InputGroup>
                        <Form.Control name='address2' value={address2} placeholder='상세주소' onChange={onChangeForm}/>
                        <div className='text-center mt-3'>
                            <Button className='ms-2 px-5' type='submit'>저장</Button>
                            <Button variant='secondary' className='ms-2 px-5'>취소</Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}

export default Mypage
