import * as React from 'react';
import { Upload, Icon, message } from 'antd';
import 'antd/dist/antd.less';
import Uploader from './Uploader';
import Cropper from './Cropper';

const Dragger = Upload.Dragger;

export interface CropViewerState {
  previewImage?: FileReader;
  selectedImage?: string,
}

export interface CropProps {
  prefixCls: string;
  value: Blob;
  onChange: (blob: Blob) => void,
  size?: Array<number>,
}

export default class CropViewer extends React.Component<CropProps, CropViewerState> {
  static defaultProps = {
    prefixCls: 'rc',
    size: [32, 32],
  };
  constructor(props) {
    super(props);
    this.state = {
      previewImage: null,
      selectedImage: null,
    };
    if (props.value) {
      this.loadSelectedImage(props.value);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.loadSelectedImage(nextProps.value);
    } else {
      this.setState({
        previewImage: null,
        selectedImage: null,
      });
    }
  }
  loadSelectedImage = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      this.setState({
        selectedImage: reader.result,
      });
    }
  }
  reset = () => {
    this.props.onChange(null);
  }
  selectImage = (reader) => {
    this.setState({
      previewImage: reader,
    });
  }
  render() {
    const { previewImage, selectedImage } = this.state;
    const { prefixCls, value, onChange, size } = this.props;

    if (selectedImage) {
      return <div className={`${prefixCls}-preview-wrapper`}>
        <div className={`${prefixCls}-preview`}>
          <div className={`${prefixCls}-preview-mask`} onClick={this.reset}>
            <Icon type="delete" />
          </div>
          <img src={selectedImage} width={size[0]} height={size[1]} />
        </div>
      </div>;
    }
    if (previewImage) {
      return <Cropper size={size} prefixCls={prefixCls} image={previewImage} onChange={onChange} />;
    }
    return <Uploader prefixCls={prefixCls} onSelectImage={this.selectImage}/>;
  }
};