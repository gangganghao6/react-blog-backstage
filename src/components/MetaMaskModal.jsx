import {Modal} from 'antd';
import {memo} from 'react';

export default memo(function MetaMaskModal({transactionAddress, isModalOpen, setIsModalOpen}) {
    const handleOk = () => {
        window.open('https://goerli.etherscan.io/tx/' + transactionAddress, '_blank')
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <Modal title="Basic Modal" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                   okText={'在区块浏览器上查看'} cancelText={'关闭'}>
                <p>交易Hash：</p>
                <a href={'https://goerli.etherscan.io/tx/' + transactionAddress}
                   target={"_blank"}>{transactionAddress}</a>
            </Modal>
        </div>
    );
});