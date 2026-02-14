EXEC	= flowfree
MROOT	= minisat
LIBDIR	= $(MROOT)/core
LIB		= lib.a
LIBEMCC = libemcc.a

CXX		?= g++
CFLAGS	?= -Wall -Wno-parentheses -std=gnu++20 -g -I $(MROOT)
EMCCFLAGS = $(CFLAGS) --use-port=zlib -lembind -sMODULARIZE -sEXPORT_ES6 -D EMCC -sALLOW_MEMORY_GROWTH
LFLAGS	?= -Wall

COBJS 	= Main.cpp FFProblem.cpp solve.cpp $(LIBDIR)/$(LIB)
EMCCOBJS = FFProblem.cpp solve.cpp $(LIBDIR)/$(LIBEMCC)

.PHONY : clean cli wasm

cli: $(EXEC)
wasm: $(EXEC).js

$(LIBDIR)/$(LIB):
	make --directory=$(LIBDIR) clean
	make --directory=$(LIBDIR) libr

$(LIBDIR)/$(LIBEMCC):
	make --directory=$(LIBDIR) clean
	make --directory=$(LIBDIR) CXX=emcc libemcc 

$(EXEC): $(COBJS)
	$(CXX) $(COBJS) $(CFLAGS) -o $@

$(EXEC).js: $(EMCCOBJS)
	emcc $(EMCCOBJS) $(EMCCFLAGS) -o $@

clean: 
	@rm -f $(EXEC) $(EXEC).js $(EXEC).wasm
