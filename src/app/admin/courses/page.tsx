"use client";
import React from 'react'
import { useState } from 'react'

const Courses = () => {

    const courseCategories = [
        { id: 1, name: 'CSS' },
        { id: 2, name: 'LNG' },
        { id: 3, name: 'GEN' },
        { id: 4, name: 'STD' },
    ]

    const [prerequisite, setprerequisite] = useState([{ prerequisite: '' }])

    const handleAddPrerequisiteCourse = () => {
        setprerequisite([...prerequisite, { prerequisite: '' }])
    }

    const handlePrerequisiteCourseChange = (index: number, value: string) => {
        const updated = prerequisite.map((course, idx) =>
            idx === index ? { ...course, prerequisite: value } : course
        )
        setprerequisite(updated)
    }

    return (
        <div className='p-8'>
            <div className="mt-3"></div>
            <h2><b>ข้อมูลรายวิชา</b></h2>
            <form action="submit" className="mt-3 opacity-50">
                <div className='flex gap-8 mb-8'>
                    <div className='flex-1'>
                        <label className='block'>กลุ่มวิชา</label>
                        <input
                            name="courseCategory"
                            type="text"
                            list="courseCategories"
                            className='w-full rounded-md border-2 border-gray-500 p-2 mt-1 bg-gray-100'
                            placeholder='input'
                            autoComplete="off"
                            required
                        />
                        <datalist id="courseCategories">
                            {courseCategories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </datalist>
                    </div>
                    <div className='flex-1'>
                        <label className='block'>รหัสวิชา</label>
                        <input name='courseId' type="text" className='w-full rounded-md border-2 border-gray-500 p-2 my-1' placeholder='input' />
                    </div>
                    <div className='flex-1'>
                        <label className='block'>หน่วยกิต</label>
                        <input name='credits' type="text" className='w-full rounded-md border-2 border-gray-500 p-2 my-1' placeholder='input' />
                    </div>
                </div>
                <div className='flex-1 mb-8'>
                    <label className='block'>ชื่อวิชาภาษาอังกฤษ</label>
                    <input name='courseNameEn' type="text" className='w-full rounded-md border-2 border-gray-500 p-2 my-1' placeholder='input' />
                </div>
                <div className='flex-1 mb-8'>
                    <label className='block'>ชื่อวิชาภาษาไทย</label>
                    <input name='courseNameTh' type="text" className='w-full rounded-md border-2 border-gray-500 p-2 my-1' placeholder='input' />
                </div>
                <div className='flex-1 mb-8'>
                    <label className='block'>ลักษณะการเรียน</label>
                    <textarea name='learningDetail' className='w-full rounded-md border-2 border-gray-500 p-2 my-1 h-50' placeholder='input'></textarea>
                </div>
            </form><div className="flex items-center justify-between mt-8 mb-2">
                <h2><b>รายวิชาบังคับ</b></h2>
                <button
                    type="button"
                    className="rounded-full border border-[#120554] text-[#120554] w-8 h-8 flex items-center justify-center text-xl hover:bg-blue-100"
                    onClick={handleAddPrerequisiteCourse}
                    aria-label="เพิ่มรายวิชาบังคับ"
                >
                    +
                </button>
            </div>
            <div className="mb-4">
                {prerequisite.map((course, idx) => (
                    <div key={idx} className="mb-3">
                        <label className="block text-gray-500 text-sm mb-1">
                            {idx + 1}. รหัสวิชาและชื่อวิชา
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border-2 border-gray-300 p-2"
                            placeholder="Input"
                            value={course.prerequisite}
                            onChange={e => handlePrerequisiteCourseChange(idx, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-4 justify-end">
                <button
                    className="border border-[#120554] text-[#120554] px-8 py-2 rounded-md bg-white"
                    type="button"
                    onClick={() => {
                        const form = document.querySelector('form') as HTMLFormElement;
                        if (form) form.reset();
                        setprerequisite([{ prerequisite: '' }]);
                    }}
                >
                    <b>ยกเลิก</b>
                </button>
                <button
                    className="bg-[#120554] text-white px-8 py-2 rounded-md"
                    type="button"
                    onClick={async (e) => {
                        e.preventDefault();
                        const form = document.querySelector('form') as HTMLFormElement;
                        const formData = new FormData(form);
                        const data = {
                            courseCategory: formData.get('courseCategory'),
                            courseCode: formData.get('courseId'),
                            credits: formData.get('credits'),
                            englishName: formData.get('courseNameEn'),
                            thaiName: formData.get('courseNameTh'),
                            learningDetail: formData.get('learningDetail'),
                            prerequisite: prerequisite.map(course => course.prerequisite)
                        };

                        try {
                            const response = await fetch('/api/courses', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data)
                            });

                            if (response.ok) {
                                const result = await response.json();
                                console.log('Success:', result);
                                form.reset();
                                setprerequisite([{ prerequisite: '' }]);
                            } else {
                                console.error('Error:', response.statusText);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }}
                >
                    <b>บันทึกข้อมูล</b>
                </button>
            </div>
        </div>
    )
}

export default Courses