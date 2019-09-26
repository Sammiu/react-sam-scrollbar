import React, {useState, useEffect} from 'react';
import ScrollBar from 'components/scrollbar/ScrollBar'
import './App.less';

function App() {

    const [data, setData] = useState(null);

    useEffect(() => {
        setData([
            {id: 'b318d8172f0b4e34b4f0c9447d751cfb', name: "北京市"},
            {id: "c095c2783b044a30b430cf15c858b810", name: "上海市"},
            {id: "d2a09e640f404b1281f63115b281e41e", name: "天津市"},
            {id: "09a0f57e502c45cbb34f6d234d2018d2", name: "重庆市"},
            {id: "3cc3559f9b434114977ddfa44427ebe7", name: "西藏自治区"},
            {id: "3cc3559f9b434114977ddfa44427ebe7465469789fgdfh", name: "广西壮族自治区"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546yrtyrtytry", name: "广东省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj089f", name: "湖南省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj97", name: "湖北省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj32", name: "江西省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj57", name: "江苏省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj44", name: "浙江省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj33", name: "安徽省"},
            {id: "3cc3559f9b434114977ddfa44427ebe746546ghjghj22", name: "贵州省",}
        ])
    }, []);

    return (
        <div className="App">
            <div className={'select-dropdown'}>
                <ScrollBar>
                    <ul className="select-dropdown_list">
                        {data && data.map(item => (
                            <li key={item.id}><span className="select-dropdown_item_text">{item.name}</span></li>))}
                    </ul>
                </ScrollBar>
            </div>
        </div>
    )
}

export default App;
