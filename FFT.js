"use strict";
var kissFFTModule = KissFFTModule({});
var kiss_fftr_alloc = kissFFTModule.cwrap(
    'kiss_fftr_alloc', 'number', ['number', 'number', 'number', 'number' ]
);
var kiss_fftr = kissFFTModule.cwrap(
    'kiss_fftr', 'void', ['number', 'number', 'number' ]
);
var kiss_fftri = kissFFTModule.cwrap(
    'kiss_fftri', 'void', ['number', 'number', 'number' ]
);
var kiss_fftr_free = kissFFTModule.cwrap(
    'kiss_fftr_free', 'void', ['number']
);
var kiss_fft_alloc = kissFFTModule.cwrap(
    'kiss_fft_alloc', 'number', ['number', 'number', 'number', 'number' ]
);
var kiss_fft = kissFFTModule.cwrap(
    'kiss_fft', 'void', ['number', 'number', 'number' ]
);
var kiss_fft_free = kissFFTModule.cwrap(
    'kiss_fft_free', 'void', ['number']
);
function KissFFT(size) {
    this.size = size;
    this.fcfg = kiss_fft_alloc(size, false);
    this.icfg = kiss_fft_alloc(size, true);
    var samplesize = 8;
    this.inptr = kissFFTModule._malloc(size*samplesize*2 + size*samplesize*2);
    this.outptr = this.inptr + size*samplesize*2;
    
    this.cin = new Float64Array(kissFFTModule.HEAPU8.buffer, this.inptr, size*2);
    this.cout = new Float64Array(kissFFTModule.HEAPU8.buffer, this.outptr, size*2);
    
    this.forward = function(cin) {
        this.cin.set(cin);
        kiss_fft(this.fcfg, this.inptr, this.outptr);
        return new Float64Array(kissFFTModule.HEAPU8.buffer,
                                this.outptr, this.size * 2);
    }
    
    this.inverse = function(cin) {
        this.cin.set(cin);
        kiss_fft(this.icfg, this.inptr, this.outptr);
        return new Float64Array(kissFFTModule.HEAPU8.buffer,
                                this.outptr, this.size * 2);
    }
    
    this.dispose = function() {
        kissFFTModule._free(this.inptr);
        kiss_fft_free(this.fcfg);
        kiss_fft_free(this.icfg);
    }
}
function KissFFTR(size) {
    this.size = size;
    this.fcfg = kiss_fftr_alloc(size, false);
    this.icfg = kiss_fftr_alloc(size, true);
    
    var samplesize = 8;
    this.rptr = kissFFTModule._malloc(size*samplesize + (size+2)*samplesize);
    this.cptr = this.rptr + size*samplesize;
    
    this.ri = new Float64Array(kissFFTModule.HEAPU8.buffer, this.rptr, size);
    this.ci = new Float64Array(kissFFTModule.HEAPU8.buffer, this.cptr, size+2);
    
    this.forward = function(real) {
        this.ri.set(real);
        kiss_fftr(this.fcfg, this.rptr, this.cptr);
        return new Float64Array(kissFFTModule.HEAPU8.buffer,
                                this.cptr, this.size + 2);
    }
    
    this.inverse = function(cpx) {
        this.ci.set(cpx);
        kiss_fftri(this.icfg, this.cptr, this.rptr);
        return new Float64Array(kissFFTModule.HEAPU8.buffer,
                                this.rptr, this.size);
    }
    
    this.dispose = function() {
        kissFFTModule._free(this.rptr);
        kiss_fftr_free(this.fcfg);
        kiss_fftr_free(this.icfg);
    }
}
