/*
* @Author: Administrator
* @Date:   2016-11-01 14:31:45
* @Last Modified by:   Administrator
* @Last Modified time: 2016-11-01 18:03:03
*/

'use strict';
var homework =`
<li>
    <div class="message">
        <p class="teacher"><span class="yu">${coursefn(data.data[i].course)}</span><span class="jiang">${data.data[i].publisher.name}老师布置了作业</span><span class="date">${datefn(data.data[i].publish_at)}</span></p>
        <div class="work-in">
            <p class="start">
            <span class="classify neirong">作业内容</span><span class="definite">${homeworkFn(data.data[i].content)}</span></p>
            <p><span class="classify voice">语音</span><span class="voice-date"><i></i>32”</span></p>
            <p class="end"><span class="classify">截止时间</span><span class="end-date">${datefn(data.data[i].deadline)}</span></p>
        </div>
            <p class="comment">共1049条评论</p>
        <div class="comment-in">
            <input type="text" value="说两句吧"/>
            <span class="button">发送</span>
            <p><span class="name">Acquisitiveness___：</span><span>非常好!我现在最低成绩都92分以上！</span></p>
            <p><span class="name">muzidanli：</span><span>作业就是快点布置，这个点慢了，希望能全方位提高学生的学习能力</span></p>
            <p><span class="name">Cedric_Xu：</span><span>今天早上在教室布置考场 也是最后一次全班聚齐 团支书就唱了栀子花开 真好听</span></p>
            <p class="check-more">查看更多</p>
        </div>
    </div>
</li>
`;
