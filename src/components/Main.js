require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import _ from 'lodash';

// 获取图片相关的数
var imagesData = require('../data/imagesData.json');
// 利用自执行函数， 将图片名信息转成图片URL路径信息
imagesData = ((imagesDataArr) => {
    for (let i = 0, j = imagesDataArr.length; i < j; i++) {
        let singleImageData = imagesDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imagesDataArr[i] = singleImageData;
    }

    return imagesDataArr;
})(imagesData);

class ImageFigure extends React.Component {
  render() {
  	let me = this;
  	let { props } = me;

    return (
    	<figure>
			<figcaption>{_.get(props, 'imagesData.fileName')}</figcaption>
			<img src={_.get(props, 'imagesData.imageURL')} />
		</figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

  	let imgFiguresJSX = [];

  	_.map(imagesData, (item) => {
  		imgFiguresJSX.push(<ImageFigure imagesData={item} />);
  	});

    return (
      <div className="index">
      	{imgFiguresJSX}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
