<div class="modal fade" id="modalUploadProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Đăng sản phẩm</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="" id="formUploadProduct" onsubmit="return false">
                    <label for="productImage">Hình ảnh</label>
                    <div class="px-4">
                        <input name="first_image" class="form-control required my-2" type="text" placeholder="Hình ảnh đại diện">
                        <input name="second_image" class="form-control my-2" type="text" placeholder="Hình ảnh minh họa">
                        <input name="third_image" class="form-control my-2" type="text" placeholder="Hình ảnh minh họa">
                    </div>
                    <div class="form-group">
                        <label>Tên sản phẩm</label>
                        <input name="name" class="form-control required my-2" type="text" placeholder="Tên sản phẩm">
                    </div>
                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea name="description" class="form-control my-2" cols="3" type="text" placeholder="Mô tả"></textarea>
                    </div>
{{--                    <div class="form-group">--}}
{{--                        <label>Số lượng sản phẩm tồn kho</label>--}}
{{--                        <input name="description" class="form-control my-2" cols="3" type="text" placeholder="Số lượng sản phẩm tồn kho">--}}
{{--                    </div>--}}
                    <div class="form-group">
                        <div class="mb-4 row">
                            <div class="col-12 col-lg-5">
                                <label for="exampleFormControlTextarea1" class="form-label fs-6 fw-bold">Gốc</label>
                                <div class="input-group mb-3">
                                    <input data-type="price" name="price" type="number" class="form-control required" placeholder="Đơn vị: VND">
                                    <span class="input-group-text">VND</span>
                                </div>
                            </div>
                            <div class="col-12 col-lg-4">
                                <label class="form-label fs-6 fw-bold">Hình thức giảm giá</label>
                                <div id="" class="dropdown dropdown-select">
                                    <button id="productTypeDiscount" data-type="percent" class="btn text-gray w-100 text-start dropdown-toggle border border-1 outline-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div>Theo phần trăm
                                            (%)</div>
                                    </button>
                                    <ul class="dropdown-menu w-100 pt-2">
                                        <li>
                                            <a data-type="percent" class="dropdown-item nav-link text-black active" href="#">Theo phần trăm
                                                (%)</a>
                                        </li>
                                        <li><a data-type="fixed" class="dropdown-item nav-link text-black" href="#">Theo giá tiền (vnđ)</a>
                                        </li>
                                    </ul>
                                </div>
                                <p class="text-muted"><small>Gợi ý: Có thể để trống</small></p>
                            </div>

                            <div class="col-12 col-lg-3">
                                <label class="form-label fs-6 fw-bold">Mức giảm</label>
                                <div class="input-group">
                                    <input id="productValueDiscount" data-type="discount" type="number" class="form-control" placeholder="%">
                                </div>
                                <p class="text-muted"><small class="number-character">Gợi ý: Có thể để trống</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="form-group my-4">
                        <label>Danh mục</label>
                        <div class="dropdown dropdown-select">
                            <button id="categoryproduct" data-value="-1" class="dropdown-toggle btn w-100 text-start d-flex align-items-center justify-content-between rounded-20 bg-gray border-0 p-2 px-3"
                                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div>
                                    <div class="text-gray fs-6">
                                        Chọn danh mục sản phẩm
                                    </div>
                                </div>
                            </button>
                            <ul class="dropdown-menu rounded-10 shadow transition-0 border-0 w-100" aria-labelledby="selectTeacher">
                                @if(isset($categories))
                                    @foreach($categories['data'] as $category)
                                        <li data-value="{{$category['id']}}" class="d-flex align-items-center cursor-pointer w-100">
                                            <img src="{{$category['image_url']}}" alt="" class="logo-xl">
                                            <a data-value="{{$category['id']}}" class="flex-fill dropdown-item mx-2 px-4 rounded-10 w-auto">{{$category['name']}}</a>
                                        </li>
                                    @endforeach
                                @endif
                            </ul>
                        </div>
                    </div>
                    <div class="form-group my-4">
                        <lable>Chọn loại</lable>
                        <div class="dropdown dropdown-select">
                            <button id="productType" data-type="phone" class="dropdown-toggle btn w-100 text-start d-flex justify-content-between rounded-20 bg-gray border-0 p-2 px-3"
                                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Chọn trạng thái
                            </button>
                            <ul class="dropdown-menu rounded-10 shadow transition-0 border-0 w-100">
                                <li><a data-type="phone" class="dropdown-item mx-2 px-4 py-2 rounded-10 w-auto">Điện thoại</a></li>
                                <li><a data-type="accessory" class="dropdown-item mx-2 px-4 py-2 rounded-10 w-auto">Phụ kiện</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group my-4">
                        <lable>Chọn trạng thái</lable>
                        <div id="status-product" class="dropdown dropdown-select">
                            <button class="dropdown-toggle btn w-100 text-start d-flex justify-content-between rounded-20 bg-gray border-0 p-2 px-3"
                                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Chọn trạng thái
                            </button>
                            <ul class="dropdown-menu rounded-10 shadow transition-0 border-0 w-100">
                                <li><a data-value="0" class="dropdown-item mx-2 px-4 py-2 rounded-10 w-auto">Published</a></li>
                                <li><a data-value="1" class="dropdown-item mx-2 px-4 py-2 rounded-10 w-auto">pending</a></li>
                            </ul>
                        </div>
                    </div>
                    <label for="">Thông số</label>
                    <div class="form-group d-flex justify-content-center">
                        <table class="table border-0 table-borderless" style="width: 300px">
                            <tr>
                                <td>Bộ nhớ: </td>
                                <td><input name="memory" data-type="memory" class="float-end" type="text"></td>
                            </tr>
                            <tr>
                                <td>Ram: </td>
                                <td><input name="ram" data-type="ram" class="float-end product-item" type="text"></td>
                            </tr>
                            <tr>
                                <td class="text-nowrap">Màn hình: </td>
                                <td><input name="display" data-type="display" class="float-end product-item" type="text"></td>
                            </tr>
                            <tr>
                                <td>Camera: </td>
                                <td><input name="camera" data-type="camera" class="float-end product-item" type="text"></td>
                            </tr>
                        </table>
                    </div>
                    <label for="">Màu sắc</label>
                    <div class="form-group">
                        <div id="eachColor">
                            <div class="px-4 product-item" data-type="color">
                                <span class="text-gray">Thêm màu sắc</span>
                                <input data-type="name" class="name color form-control my-2" type="text" placeholder="Tên màu">
                                <input data-type="value" class="value color form-control my-2" type="text" placeholder="Mã màu (RGB)">
                                <input data-type="image" class="image color form-control my-2" type="text" placeholder="URL Hình ảnh minh họa">
                                <input data-type="inventory" class="image color form-control my-2" type="text" placeholder="Số sản phẩm tồn kho">
                                <input data-type="price_value_fixed" class="price-fixed color form-control my-2" type="text" placeholder="Mức giá thay đổi">
                            </div>
                        </div>
                        <a onclick="product.duplicate('#eachColor',product.genColorInput)" class="text-primary ms-4 cursor-pointer">+ Thêm mục khác</a>
                    </div>
                   <div class="text-end mt-4">
                       <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                       <button onclick="product.create()" type="submit" class="btn btn-primary">Save changes</button>
                   </div>
                </form>
            </div>

        </div>
    </div>
</div>
