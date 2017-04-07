/*
* @Author: Administrator
* @Date:   2016-10-28 18:00:56
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-29 14:28:52
*/


var myClass =`
<li >
    <div class="class-txt">
        <p class="schools">华中师范大学附属第一中学高三(2)班${data.data[0].school[school_name]} + ${fn(data.data[0].grade)} + ${data.data[0].name}</p>
        <p><span>班号：${data.data[0].id}</span><span class="copy">   复制</span></p>
        <p>教师：${classTnfn(data.data[0].classmembers)}【教号:${classTfn(data.data[0].classmenbers)}】</p>
    </div>
</li>
`;

