import {Descriptions, Modal, Skeleton} from 'antd';
import {memo} from 'react';

export default memo(function MetaMaskModal({
                                               transactionAddress,
                                               isModalOpen,
                                               transactionResult,
                                               setIsModalOpen,
                                               transactionIsPending
                                           }) {
    const {
        blockHash,
        blockNumber,
        cumulativeGasUsed,
        effectiveGasPrice,
        from,
        gasUsed,
        status,
        to,
        transactionHash,
        transactionIndex,
        type
    } = transactionResult || {
        blockHash: '',
        blockNumber: '',
        cumulativeGasUsed: '',
        effectiveGasPrice: '',
        from: '',
        gasUsed: '',
        status: '',
        to: '',
        transactionHash: '',
        transactionIndex: '',
        type: ''
    };
    const handleOk = () => {
        window.open('https://goerli.etherscan.io/tx/' + transactionAddress, '_blank')
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    console.log(transactionResult)
    const Result = <>
        <Descriptions title="Transaction Info" bordered>
            <Descriptions.Item label="Block Hash" span={3}>{blockHash}</Descriptions.Item>
            <Descriptions.Item label="Transaction Hash" span={3}>{transactionHash}</Descriptions.Item>
            <Descriptions.Item label="Block Number" span={2}>{blockNumber}</Descriptions.Item>
            <Descriptions.Item label="Status">{status.toString()}</Descriptions.Item>
            <Descriptions.Item label="Cumulative Gas Used" span={2}>{cumulativeGasUsed}</Descriptions.Item>
            <Descriptions.Item label="Effective Gas Price" span={2}>{effectiveGasPrice} WEI</Descriptions.Item>
            <Descriptions.Item label="Transaction Index">{transactionIndex}</Descriptions.Item>
            <Descriptions.Item label="Type">{type}</Descriptions.Item>
            <Descriptions.Item label="Gas Used">{gasUsed}</Descriptions.Item>
            <Descriptions.Item label="From" span={3}>{from}</Descriptions.Item>
            <Descriptions.Item label="To" span={3}>{to}</Descriptions.Item>

        </Descriptions>
    </>
    return (
        <div>
            <Modal width={"50vw"} title={transactionIsPending ? "正在等待交易被确认..." : "交易已被确认"}
                   visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                   okText={'在区块浏览器上查看'} cancelText={'关闭'}>
                <p>交易Hash：</p>
                <p>{transactionAddress}</p>
                {transactionIsPending ? <Skeleton active/> : Result}
            </Modal>
        </div>
    );
});