namespace openfl._internal.backend.lime_standalone; #if openfl_html5

import haxe.io.Bytes;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.Image as HTMLImage;
import js.html.ImageData;
import js.Browser;
#if haxe4
import js.lib.Uint8ClampedArray;
#else
import js.html.Uint8ClampedArray;
#end
import openfl._internal.bindings.typedarray.UInt8Array;

@: allow(openfl._internal.backend.lime_standalone.Image)
class ImageBuffer
{
	public bitsPerPixel: number;
	public data: number8Array;
	public format: PixelFormat;
	public height: number;
	public premultiplied: boolean;
	public src(get, set): Dynamic;
	public stride(get, never): number;
	public transparent: boolean;
	public width: number;

	protected __srcCanvas: CanvasElement;
	protected __srcContext: CanvasRenderingContext2D;
	protected __srcCustom: Dynamic;
	protected __srcImage: HTMLImage;
	protected __srcImageData: ImageData;

	public new(data: number8Array = null, width: number = 0, height: number = 0, bitsPerPixel: number = 32, format: PixelFormat = null)
	{
		this.data = data;
		this.width = width;
		this.height = height;
		this.bitsPerPixel = bitsPerPixel;
		this.format = (format == null ? RGBA32 : format);
		premultiplied = false;
		transparent = true;
	}

	public clone(): ImageBuffer
	{
		var buffer = new ImageBuffer(data, width, height, bitsPerPixel);

		if (data != null)
		{
			buffer.data = new UInt8Array(data.byteLength);
			var copy = new UInt8Array(data);
			buffer.data.set(copy);
		}
		else if (__srcImageData != null)
		{
			buffer.__srcCanvas = cast Browser.document.createElement("canvas");
			buffer.__srcContext = cast buffer.__srcCanvas.getContext("2d");
			buffer.__srcCanvas.width = __srcImageData.width;
			buffer.__srcCanvas.height = __srcImageData.height;
			buffer.__srcImageData = buffer.__srcContext.createImageData(__srcImageData.width, __srcImageData.height);
			var copy = new Uint8ClampedArray(__srcImageData.data);
			buffer.__srcImageData.data.set(copy);
		}
		else if (__srcCanvas != null)
		{
			buffer.__srcCanvas = cast Browser.document.createElement("canvas");
			buffer.__srcContext = cast buffer.__srcCanvas.getContext("2d");
			buffer.__srcCanvas.width = __srcCanvas.width;
			buffer.__srcCanvas.height = __srcCanvas.height;
			buffer.__srcContext.drawImage(__srcCanvas, 0, 0);
		}
		else
		{
			buffer.__srcImage = __srcImage;
		}

		buffer.bitsPerPixel = bitsPerPixel;
		buffer.format = format;
		buffer.premultiplied = premultiplied;
		buffer.transparent = transparent;
		return buffer;
	}

	// Get & Set Methods
	protected get_src(): Dynamic
	{
		if (__srcImage != null) return __srcImage;
		return __srcCanvas;
	}

	protected set_src(value: Dynamic): Dynamic
	{
		if (Std.is(value, HTMLImage))
		{
			__srcImage = cast value;
		}
		else if (Std.is(value, CanvasElement))
		{
			__srcCanvas = cast value;
			__srcContext = cast __srcCanvas.getContext("2d");
		}
		return value;
	}

	protected get_stride(): number
	{
		return width * Std.int(bitsPerPixel / 8);
	}
}
#end
